import React from 'react';
import { useAuth } from '../context/AuthContext';

function WompiCheckout({ planType, planName, amount, onError }) {
  const { user } = useAuth();

  const handlePayment = () => {
    if (!user) {
      onError('Debes iniciar sesión primero');
      return;
    }

    const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
    
    if (!publicKey) {
      onError('Error de configuración: clave de Wompi no encontrada');
      return;
    }

    // URL directa de checkout de Wompi
    const url = `https://checkout.wompi.co/v2/checkout?public_key=${publicKey}&amount=${amount}&currency=COP&customer_email=${user.email}&customer_name=${encodeURIComponent(user.name)}&reference=${planType}-${Date.now()}`;
    
    // Redirigir directamente
    window.location.href = url;
  };

  return (
    <button 
      onClick={handlePayment} 
      className="btn btn-primary"
      style={{ width: '100%' }}
    >
      Suscribirse por {amount.toLocaleString('es-CO')} COP/mes
    </button>
  );
}

export default WompiCheckout;