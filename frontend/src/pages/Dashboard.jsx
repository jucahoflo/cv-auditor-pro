import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/audit/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  const remaining = stats?.creditsLimit - stats?.creditsUsed;
  const percentage = ((stats?.creditsUsed || 0) / (stats?.creditsLimit || 5)) * 100;

  const getPlanBadge = () => {
    const plans = {
      free: { name: 'Gratuito', color: '#718096', bg: '#edf2f7' },
      basic: { name: 'Básico', color: '#2b6cb0', bg: '#ebf8ff' },
      pro: { name: 'Profesional', color: '#2f855a', bg: '#f0fff4' },
      enterprise: { name: 'Empresa', color: '#9b2c2c', bg: '#fff5f5' }
    };
    return plans[stats?.plan] || plans.free;
  };

  const planBadge = getPlanBadge();

  return (
    <div className="container">
      {/* Header con bienvenida */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          ¡Bienvenido, {user?.name}! 🎉
        </h1>
        <p style={{ opacity: 0.9 }}>Gestiona tus auditorías de CV y mejora tus oportunidades laborales</p>
      </div>

      <div className="dashboard-grid">
        {/* Tarjeta de acciones rápidas */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <h3 style={{ marginBottom: '1rem' }}>Acciones Rápidas</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/audit" className="btn btn-primary">
              📄 Nueva Auditoría
            </Link>
            <Link to="/history" className="btn btn-secondary">
              📜 Ver Historial
            </Link>
          </div>
        </div>

        {/* Tarjeta de estadísticas */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📊 Resumen
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                {stats?.totalAudits || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>Auditorías</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
                {stats?.plan === 'free' ? 'Gratuito' : stats?.plan}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>Plan actual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de suscripción */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>💎 Estado de Suscripción</h3>
          <span style={{
            background: planBadge.bg,
            color: planBadge.color,
            padding: '0.25rem 0.75rem',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            {planBadge.name}
          </span>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Créditos usados</span>
            <span><strong>{stats?.creditsUsed || 0}</strong> de {stats?.creditsLimit || 5}</span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#718096' }}>Créditos restantes</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
              {remaining}
            </div>
          </div>
          {stats?.plan === 'free' && (
            <Link to="/pricing" className="btn btn-primary">
              🔥 Actualizar Plan
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;