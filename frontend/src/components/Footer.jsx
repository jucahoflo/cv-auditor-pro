import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      padding: '2rem 1rem',
      marginTop: '3rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block'
          }}>
            🔥 KillerJobs
          </h2>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Auditoría de CV con IA para conseguir el trabajo de tus sueños</p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '1rem', opacity: 0.8 }}>🎨 Diseñado por</span>
          <span style={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: '1.1rem'
          }}>
            Juan Carlos Holguín
          </span>
          <span style={{ fontSize: '1rem', opacity: 0.8 }}>|</span>
          <span style={{ fontWeight: '600', color: '#f5576c' }}>Getsumi Design Architect</span>
        </div>

        <div style={{
          width: '60px',
          height: '2px',
          background: 'linear-gradient(90deg, #f093fb, #f5576c)',
          margin: '1rem auto',
          borderRadius: '2px'
        }}></div>

        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
          <p>© {currentYear} KillerJobs. Todos los derechos reservados.</p>
        </div>

        <div
          style={{
            marginTop: '1rem',
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: 'rgba(240, 147, 251, 0.2)',
            borderRadius: '2rem',
            fontSize: '0.7rem',
            transition: 'all 0.3s ease',
            cursor: 'default',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(240, 147, 251, 0.4)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(240, 147, 251, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⚡ GETSUMI DESIGN ARCHITECT ⚡
        </div>
      </div>
    </footer>
  );
}

export default Footer;