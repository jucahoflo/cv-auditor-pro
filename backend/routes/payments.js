const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const Stripe = require('stripe');

// Inicializar Stripe con la clave secreta
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Crear sesión de checkout
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { priceId } = req.body;
    const user = req.user;

    console.log('🔵 Creando sesión de checkout para usuario:', user.userId);
    console.log('🔵 Price ID recibido:', priceId);

    // Buscar usuario en la base de datos
    const dbUser = await User.findById(user.userId);
    if (!dbUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear o obtener cliente de Stripe
    let customerId = dbUser.subscription.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name,
        metadata: {
          platform: 'CV-AUDITOR-PRO',
          userId: dbUser._id.toString()
        }
      });
      customerId = customer.id;
      dbUser.subscription.stripeCustomerId = customerId;
      await dbUser.save();
      console.log('✅ Cliente creado:', customerId);
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.userId
      }
    });

    console.log('✅ Sesión de checkout creada:', session.id);
    res.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('❌ Error al crear sesión:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook para eventos de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Error de webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutCompleted(session);
      break;
    
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await handleSubscriptionDeleted(subscription);
      break;
    
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('✅ Pago exitoso:', invoice.id);
      break;
    
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('❌ Pago fallido:', failedInvoice.id);
      break;
  }

  res.json({ received: true });
});

// Manejar checkout completado
async function handleCheckoutCompleted(session) {
  try {
    const userId = session.metadata.userId;
    const customerId = session.customer;
    
    // Obtener la suscripción de Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1
    });
    
    const subscription = subscriptions.data[0];
    
    // Determinar el plan basado en el precio
    let plan = 'basic';
    let creditsLimit = 50;
    
    // Actualizar usuario en MongoDB
    await User.findByIdAndUpdate(userId, {
      'subscription.plan': plan,
      'subscription.creditsLimit': creditsLimit,
      'subscription.creditsUsed': 0,
      'subscription.stripeSubscriptionId': subscription.id,
      'subscription.subscriptionEndDate': new Date(subscription.current_period_end * 1000)
    });
    
    console.log(`✅ Usuario ${userId} actualizado a plan ${plan} con ${creditsLimit} créditos`);
  } catch (error) {
    console.error('❌ Error en checkout completado:', error);
  }
}

// Manejar suscripción cancelada
async function handleSubscriptionDeleted(subscription) {
  try {
    await User.findOneAndUpdate(
      { 'subscription.stripeSubscriptionId': subscription.id },
      {
        'subscription.plan': 'free',
        'subscription.creditsLimit': 5,
        'subscription.creditsUsed': 0,
        'subscription.stripeSubscriptionId': null,
        'subscription.subscriptionEndDate': null
      }
    );
    console.log(`✅ Suscripción ${subscription.id} cancelada, usuario vuelto a plan free`);
  } catch (error) {
    console.error('❌ Error al cancelar suscripción:', error);
  }
}

module.exports = router;