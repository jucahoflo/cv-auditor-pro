import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Cargar script de Wompi
const loadWompiScript = () => {
  return new Promise((resolve) => {
    if (window.Wompi) {
      resolve(window.Wompi);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.onload = () => resolve(window.Wompi);
    document.body.appendChild(script);
  });
};

function WompiCheckout({ planType, planName, amount, onSuccess, onError }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      onError && onError('Debes iniciar sesión primero');
      return;
    }

    setLoading(true);
    try {
      const wompi = await loadWompiScript();
      
      console.log('Wompi cargado:', wompi);
      console.log('Public Key:', import.meta.env.VITE_WOMPI_PUBLIC_KEY);
      
      // Configurar el checkout de Wompi
      const checkout = new wompi.Checkout({
        publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
        currency: 'COP',
        amount: amount,
        subscription: {
          name: planName,
          interval: 'monthly'
        },
        customerData: {
          email: user.email,
          name: user.name
        },
        methods: ['CARD', 'PSE', 'NEQUI', 'DAVIPLATA'],
        onSuccess: async (result) => {
          console.log('Pago exitoso:', result);
          try {
            // Enviar token al backend para crear suscripción
            const response = await axios.post('/api/wompi/create-subscription', {
              paymentSourceToken: result.payment_source_token,
              planType: planType
            });
            
            if (response.data.success) {
              onSuccess && onSuccess(response.data);
            } else {
              onError && onError('Error al activar la suscripción');
            }
          } catch (err) {
            console.error('Error en backend:', err);
            onError && onError('Error al procesar la suscripción en el servidor');
          }
        },
        onError: (error) => {
          console.error('Error en pago:', error);
          onError && onError(error.message || 'Error en el proceso de pago');
        },
        onClose: () => {
          setLoading(false);
        }
      });
      
      checkout.open();
    } catch (error) {
      console.error('Error al cargar Wompi:', error);
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