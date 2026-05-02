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

    // Generar referencia única
    const reference = `${planType}_${user.id}_${Date.now()}`;
    
    // Construir URL de checkout con todos los parámetros
    const params = new URLSearchParams({
      'public-key': publicKey,
      currency: 'COP',
      'amount-in-cents': amount * 100, // Wompi usa centavos
      'customer-email': user.email,
      'customer-name': user.name,
      'customer-data': JSON.stringify({
        email: user.email,
        full_name: user.name
      }),
      'reference': reference,
      'redirect-url': window.location.origin + '/dashboard',
      'signature-integrity': 'none' // Para sandbox
    });

    const url = `https://checkout.wompi.co/v2/checkout?${params.toString()}`;
    
    console.log('Redirigiendo a:', url);
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