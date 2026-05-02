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
    
    const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
    console.log('Public Key:', publicKey);
    
    if (!publicKey) {
      onError('Variable de entorno VITE_WOMPI_PUBLIC_KEY no configurada');
      setLoading(false);
      return;
    }

    try {
      // Usar el checkout de Wompi versión 2
      const checkoutUrl = `https://checkout.wompi.co/v2/checkout?public_key=${publicKey}&amount=${amount}&currency=COP&customer_email=${user.email}&customer_name=${encodeURIComponent(user.name)}&reference=${planType}_${Date.now()}`;
      
      // Abrir en nueva ventana
      window.open(checkoutUrl, '_blank');
      
      // Simular éxito (temporalmente)
      setTimeout(() => {
        onSuccess && onSuccess({ success: true });
      }, 3000);
      
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