import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function WompiCheckout({ planType, planName, amount, onSuccess, onError }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      onError && onError('Debes iniciar sesión primero');
      return;
    }

    setLoading(true);
    
    // Verificar que la variable existe
    const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
    console.log('Public Key:', publicKey);
    
    if (!publicKey) {
      onError('Variable de entorno VITE_WOMPI_PUBLIC_KEY no configurada');
      setLoading(false);
      return;
    }

    try {
      // Abrir checkout de Wompi directamente con redirect
      const checkoutUrl = `https://checkout.wompi.co/v1/checkout?public_key=${publicKey}&currency=COP&amount=${amount}&customer_email=${user.email}&customer_name=${encodeURIComponent(user.name)}&reference=${Date.now()}&subscription=true&subscription_name=${encodeURIComponent(planName)}&subscription_interval=monthly`;
      
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Error:', error);
      onError && onError('Error al iniciar el checkout de Wompi');
      setLoading(false);
    }
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