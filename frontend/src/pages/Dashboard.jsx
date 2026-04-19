import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SubscriptionStatus from '../components/SubscriptionStatus';

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

  return (
    <div className="container">
      <h1>Bienvenido, {user?.name} 👋</h1>
      
      <div className="dashboard-grid">
        <div>
          <div className="card">
            <h3>🎯 Acciones Rápidas</h3>
            <Link to="/audit" className="btn btn-primary" style={{ marginRight: '1rem' }}>
              + Nueva Auditoría
            </Link>
            <Link to="/history" className="btn btn-secondary">
              📜 Ver Historial
            </Link>
          </div>
          
          <div className="card">
            <h3>📈 Resumen</h3>
            <p><strong>Total de auditorías realizadas:</strong> {stats?.totalAudits || 0}</p>
            <p><strong>Plan actual:</strong> {stats?.plan === 'free' ? 'Gratuito' : stats?.plan}</p>
          </div>
        </div>
        
        <div>
          {stats && <SubscriptionStatus subscription={stats} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;