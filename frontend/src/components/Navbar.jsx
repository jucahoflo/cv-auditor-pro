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

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📄 CV-AUDITOR-PRO
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/audit">Nueva Auditoría</Link>
            <Link to="/history">Historial</Link>
            <Link to="/pricing">Planes</Link>
            <span style={{ color: '#667eea' }}>👋 {user.name}</span>
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