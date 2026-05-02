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

    // Usar la ruta /v2/checkout (NO /hello)
    const baseUrl = 'https://checkout.wompi.co/v2/checkout';
    
    // Crear los parámetros de forma explícita
    const params = new URLSearchParams({
      'public-key': publicKey,
      'currency': 'COP',
      'amount-in-cents': (amount * 100).toString(), // Wompi trabaja con centavos
      'customer-email': user.email,
      'customer-name': user.name,
      'reference': `${planType}_${user.id}_${Date.now()}`
    });

    const url = `${baseUrl}?${params.toString()}`;
    
    console.log('Redirigiendo a Wompi con URL:', url);
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