import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function CoverLetter() {
  const { user } = useAuth();
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [skills, setSkills] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle || !companyName || !skills) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    setCoverLetter('');

    try {
      const response = await axios.post('/api/audit/cover-letter', {
        jobTitle,
        companyName,
        skills,
        additionalInfo
      });
      setCoverLetter(response.data.coverLetter);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al generar la carta');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    alert('¡Carta copiada al portapapeles!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Carta_Presentacion_${companyName}_${jobTitle.replace(/\s/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝 Generador de Carta de Presentación</h1>
        <p style={{ color: '#718096' }}>Ingresa los datos del puesto y la IA generará una carta profesional personalizada</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🎯 Puesto *</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ej: Ingeniero de Software Senior"
              required
            />
          </div>

          <div className="form-group">
            <label>🏢 Empresa *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej: Google, Mercado Libre, etc."
              required
            />
          </div>

          <div className="form-group">
            <label>⚡ Habilidades destacadas *</label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Ej: React, Node.js, Python, Liderazgo de equipos, Metodologías ágiles..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>📌 Información adicional (opcional)</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Ej: 5 años de experiencia, logros destacados, disponibilidad inmediata, etc."
              rows={2}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ width: '100%' }}
          >
            {loading ? '✍️ Generando carta...' : '📝 Generar Carta de Presentación'}
          </button>
        </form>
      </div>

      {coverLetter && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>📄 Tu Carta de Presentación</h3>
          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            marginBottom: '1rem',
            maxHeight: '500px',
            overflowY: 'auto',
            border: '1px solid #e2e8f0'
          }}>
            {coverLetter}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleCopy} className="btn btn-secondary">
              📋 Copiar al portapapeles
            </button>
            <button onClick={handleDownload} className="btn btn-primary">
              💾 Descargar como TXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverLetter;