import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const BASIC_PRICE_ID = 'price_1TMHOn4GZdNJCcqJNimyfomO';

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    setLoading(true);
    setSelectedPlan('basic');

    try {
      const response = await axios.post('/api/payments/create-checkout-session', {
        priceId: BASIC_PRICE_ID
      });

      const stripeUrl = response.data.url;
      if (stripeUrl) {
        window.location.href = stripeUrl;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error || 'Error al iniciar el proceso de pago');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Planes para CV-AUDITOR-PRO</h1>
        <p style={{ color: '#718096' }}>Elige el plan que mejor se adapte a tus necesidades</p>
      </div>
      
      <div className="pricing-grid">
        {/* Plan Gratuito */}
        <div className="pricing-card">
          <h2 style={{ fontSize: '1.5rem' }}>Gratuito</h2>
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">0</span>
            <span className="period">/mes</span>
          </div>
          <div style={{ marginBottom: '1rem', color: '#48bb78', fontWeight: '600' }}>
            5 auditorías por mes
          </div>
          <ul className="features">
            <li>✓ 5 auditorías por mes</li>
            <li>✓ Análisis básico IA</li>
            <li>✓ Historial 30 días</li>
            <li>✓ Soporte email</li>
          </ul>
          <button 
            className="btn btn-secondary"
            disabled={user?.subscription?.plan === 'free'}
            style={{ width: '100%' }}
          >
            {user?.subscription?.plan === 'free' ? '✅ Plan Actual' : 'Comenzar Gratis'}
          </button>
        </div>

        {/* Plan Básico */}
        <div className="pricing-card recommended">
          <div className="recommended-badge">🔥 MÁS POPULAR</div>
          <h2 style={{ fontSize: '1.5rem' }}>Básico</h2>
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">19.99</span>
            <span className="period">/mes</span>
          </div>
          <div style={{ marginBottom: '1rem', color: '#667eea', fontWeight: '600' }}>
            50 auditorías por mes
          </div>
          <ul className="features">
            <li>✓ 50 auditorías por mes</li>
            <li>✓ Análisis avanzado IA</li>
            <li>✓ Historial 6 meses</li>
            <li>✓ Soporte prioritario</li>
            <li>✓ Reportes detallados</li>
          </ul>
          <button 
            className="btn btn-primary"
            onClick={handleSubscribe}
            disabled={loading || user?.subscription?.plan === 'basic'}
            style={{ width: '100%' }}
          >
            {loading && selectedPlan === 'basic' ? '⏳ Procesando...' : user?.subscription?.plan === 'basic' ? '✅ Plan Actual' : '🚀 Suscribirse por $19.99/mes'}
          </button>
        </div>
      </div>

      {/* Info adicional */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        padding: '1rem',
        background: '#f7fafc',
        borderRadius: '1rem',
        fontSize: '0.875rem',
        color: '#718096'
      }}>
        <p>Todos los planes incluyen análisis con IA de última generación. Los precios son en USD más impuestos aplicables.</p>
      </div>
    </div>
  );
}

export default Pricing;