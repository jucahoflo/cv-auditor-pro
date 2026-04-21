import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.subscription?.role === 'admin';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🔥 KillerJobs
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/audit">📄 Nueva Auditoría</Link>
            <Link to="/history">📜 Historial</Link>
            <Link to="/pricing">💎 Planes</Link>
            {isAdmin && (
              <Link to="/admin" style={{ background: '#f5576c', color: 'white', borderRadius: '20px', padding: '0.5rem 1rem' }}>
                👑 Admin
              </Link>
            )}
            <span style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '0.25rem 0.75rem',
              borderRadius: '2rem',
              color: 'white',
              fontSize: '0.875rem'
            }}>
              👤 {user.name}
            </span>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
            <Link to="/pricing">Planes</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;