import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Price ID del plan Básico
  const BASIC_PRICE_ID = 'price_1TMHOn4GZdNJCcqJNimyfomO';

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    setLoading(true);

    try {
      console.log('🔵 Enviando solicitud al backend...');
      const response = await axios.post('/api/payments/create-checkout-session', {
        priceId: BASIC_PRICE_ID
      });

      console.log('✅ Respuesta recibida:', response.data);

      // Redirigir directamente a la URL de checkout
      const stripeUrl = response.data.url;
      if (stripeUrl) {
        window.location.href = stripeUrl;
      } else {
        throw new Error('No se recibió URL de checkout');
      }

    } catch (error) {
      console.error('❌ Error:', error);
      alert(error.response?.data?.error || 'Error al iniciar el proceso de pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Planes para CV-AUDITOR-PRO</h1>
        <p>Elige el plan que mejor se adapte a tus necesidades</p>
      </div>
      
      <div className="pricing-grid">
        {/* Plan Gratuito */}
        <div className="pricing-card">
          <h2>Gratuito</h2>
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">0</span>
            <span className="period">/mes</span>
          </div>
          <div>5 auditorías por mes</div>
          <ul className="features">
            <li>✓ 5 auditorías por mes</li>
            <li>✓ Análisis básico IA</li>
            <li>✓ Historial 30 días</li>
          </ul>
          <button 
            className="btn btn-secondary"
            disabled={user?.subscription?.plan === 'free'}
            style={{ width: '100%' }}
          >
            {user?.subscription?.plan === 'free' ? 'Plan Actual' : 'Comenzar Gratis'}
          </button>
        </div>

        {/* Plan Básico (Pago) */}
        <div className="pricing-card recommended">
          <div className="recommended-badge">RECOMENDADO</div>
          <h2>Básico</h2>
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">19.99</span>
            <span className="period">/mes</span>
          </div>
          <div>50 auditorías por mes</div>
          <ul className="features">
            <li>✓ 50 auditorías por mes</li>
            <li>✓ Análisis avanzado IA</li>
            <li>✓ Historial 6 meses</li>
            <li>✓ Soporte email</li>
          </ul>
          <button 
            className="btn btn-primary"
            onClick={handleSubscribe}
            disabled={loading || user?.subscription?.plan === 'basic'}
            style={{ width: '100%' }}
          >
            {loading ? 'Procesando...' : user?.subscription?.plan === 'basic' ? 'Plan Actual' : 'Suscribirse por $19.99/mes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;