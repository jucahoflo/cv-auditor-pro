import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Audit() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo CV');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Por favor ingresa la descripción del puesto');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('cv', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('/api/audit/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data.analysis);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al analizar el CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🔍 Auditoría de CV</h2>
        <p>Sube tu CV y pega la descripción del puesto para obtener un análisis profesional.</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📄 Archivo CV (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>📝 Descripción del Puesto</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Pega aquí la descripción del puesto..."
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analizando...' : 'Analizar CV'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card">
          <h3>📊 Resultado del Análisis</h3>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
              {result.score}%
            </div>
            <p>Puntuación de compatibilidad</p>
          </div>
          
          <div className="dashboard-grid">
            <div>
              <h4 style={{ color: '#48bb78' }}>✅ Fortalezas</h4>
              <ul>
                {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              
              <h4 style={{ color: '#f56565' }}>⚠️ Áreas de Mejora</h4>
              <ul>
                {result.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#ed8936' }}>🎯 Habilidades Faltantes</h4>
              <ul>
                {result.missingSkills?.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
              
              <h4 style={{ color: '#4299e1' }}>💡 Recomendaciones</h4>
              <ul>
                {result.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '5px' }}>
            <h4>📋 Resumen</h4>
            <p>{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Audit;