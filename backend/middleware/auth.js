const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

const checkSubscription = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // ADMIN: pasa sin verificar créditos
    if (user.subscription.role === 'admin') {
      req.userData = user;
      return next();
    }

    // Verificar si tiene créditos disponibles
    if (user.subscription.creditsUsed >= user.subscription.creditsLimit && user.subscription.plan !== 'enterprise') {
      return res.status(403).json({ 
        error: 'Has alcanzado tu límite de auditorías. Actualiza tu plan para continuar.',
        needsUpgrade: true
      });
    }

    // Verificar fecha de expiración
    if (user.subscription.subscriptionEndDate && new Date() > user.subscription.subscriptionEndDate) {
      user.subscription.plan = 'free';
      user.subscription.creditsLimit = 5;
      user.subscription.creditsUsed = 0;
      await user.save();
      return res.status(403).json({ 
        error: 'Tu suscripción ha expirado. Renueva para continuar.',
        needsUpgrade: true
      });
    }

    req.userData = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar suscripción' });
  }
};

// Verificar si es administrador
const isAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);
    
    if (!user || user.subscription.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { authenticateToken, checkSubscription, isAdmin };