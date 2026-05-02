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

    // Parámetros mínimos pero obligatorios
    // Wompi requiere que amount-in-cents sea un número entero (centavos)
    const amountInCents = amount * 100;
    
    // Construir URL manualmente (sin URLSearchParams para evitar codificación doble)
    const url = `https://checkout.wompi.co/v2/checkout?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&customer-email=${user.email}&reference=${planType}_${Date.now()}`;
    
    console.log('URL generada:', url);
    
    // Abrir en la misma ventana
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