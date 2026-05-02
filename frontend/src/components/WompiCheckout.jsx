import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function WompiCheckout({ planType, planName, amount, onSuccess, onError }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    if (!user) {
      onError('Debes iniciar sesión primero');
      return;
    }

    setLoading(true);
    
    const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
    if (!publicKey) {
      onError('Variable de entorno VITE_WOMPI_PUBLIC_KEY no configurada');
      setLoading(false);
      return;
    }

    // Usar el checkout de Wompi versión 2 con enlace directo
    const checkoutUrl = `https://checkout.wompi.co/v2/checkout?public_key=${publicKey}&amount=${amount}&currency=COP&customer_email=${user.email}&customer_name=${encodeURIComponent(user.name)}&reference=${planType}_${Date.now()}`;
    
    // Guardar información en localStorage para procesar después del pago
    localStorage.setItem('pendingSubscription', JSON.stringify({
      planType,
      amount,
      timestamp: Date.now()
    }));
    
    // Redirigir a Wompi
    window.location.href = checkoutUrl;
  };

  return (
    <button 
      onClick={handlePayment} 
      className="btn btn-primary"
      disabled={loading}
      style={{ width: '100%' }}
    >
      {loading ? 'Procesando...' : `Suscribirse por ${amount.toLocaleString('es-CO')} COP/mes`}
    </button>
  );
}

export default WompiCheckout;