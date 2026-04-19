import React from 'react';
import { Link } from 'react-router-dom';

function SubscriptionStatus({ subscription }) {
  const remaining = subscription.creditsLimit - subscription.creditsUsed;
  const percentage = (subscription.creditsUsed / subscription.creditsLimit) * 100;

  return (
    <div className="card">
      <h3>📊 Estado de Suscripción</h3>
      <p><strong>Plan:</strong> {subscription.plan === 'free' ? 'Gratuito' : subscription.plan}</p>
      <p><strong>Créditos usados:</strong> {subscription.creditsUsed} de {subscription.creditsLimit}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percentage}%` }}></div>
      </div>
      <p><strong>Créditos restantes:</strong> {remaining}</p>
      {subscription.plan === 'free' && remaining < 3 && (
        <Link to="/pricing" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          🔥 Actualizar Plan
        </Link>
      )}
    </div>
  );
}

export default SubscriptionStatus;