import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WompiCheckout from '../components/WompiCheckout';

function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePaymentSuccess = () => {
    setLoading(false);
    alert('🎉 ¡Suscripción exitosa! Tu plan ha sido actualizado.');
    window.location.href = '/dashboard';
  };

  const handlePaymentError = (error) => {
    setLoading(false);
    alert(`❌ Error en el pago: ${error}`);
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Planes KillerJobs</h1>
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

        {/* Plan Básico - Wompi */}
        <div className="pricing-card recommended">
          <div className="recommended-badge">🔥 MÁS POPULAR</div>
          <h2 style={{ fontSize: '1.5rem' }}>Básico</h2>
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">30,000</span>
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
          {user?.subscription?.plan === 'basic' ? (
            <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
              ✅ Plan Actual
            </button>
          ) : (
            <WompiCheckout
              planType="basic"
              planName="KillerJobs Básico"
              amount={30000}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Pricing;