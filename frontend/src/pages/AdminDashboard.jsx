import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  const getPlanColor = (plan, role) => {
    if (role === 'admin') return '#f5576c';
    switch (plan) {
      case 'enterprise': return '#9b2c2c';
      case 'pro': return '#2f855a';
      case 'basic': return '#2b6cb0';
      default: return '#718096';
    }
  };

  const getPlanName = (plan, role) => {
    if (role === 'admin') return 'ADMIN';
    switch (plan) {
      case 'enterprise': return 'Empresa';
      case 'pro': return 'Pro';
      case 'basic': return 'Básico';
      default: return 'Gratuito';
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊 Panel de Administración</h1>
        <p style={{ color: '#718096' }}>Bienvenido, {user?.name}</p>
      </div>
      
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{stats?.totalUsers || 0}</div>
          <div style={{ color: '#718096' }}>Usuarios Registrados</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{stats?.totalAudits || 0}</div>
          <div style={{ color: '#718096' }}>Auditorías Realizadas</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>👤 Lista de Usuarios</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Plan</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Créditos</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Auditorías</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px' }}>
                    <strong>{u.name}</strong>
                    {u.subscription?.role === 'admin' && (
                      <span style={{ marginLeft: '8px', fontSize: '10px', background: '#f5576c', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>ADMIN</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', color: '#4a5568' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: getPlanColor(u.subscription?.plan, u.subscription?.role),
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getPlanName(u.subscription?.plan, u.subscription?.role)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {u.subscription?.creditsUsed} / {u.subscription?.creditsLimit === 999999 ? '∞' : u.subscription?.creditsLimit}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{u.auditHistory?.length || 0}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#718096' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;