import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { generatePDF } from '../services/pdfService';

function Audit() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Por favor selecciona un archivo PDF válido');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Por favor sube un archivo PDF válido');
    }
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

  const handleDownloadPDF = () => {
    if (result) {
      generatePDF(result, file?.name, user);
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍 Auditoría KillerJobs</h1>
        <p style={{ color: '#718096' }}>Sube tu CV y pega la descripción del puesto para obtener un análisis profesional con IA</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📄 Archivo CV (PDF)</label>
            <div
              className={`file-upload-area ${dragOver ? 'dragover' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
              <p style={{ marginBottom: '0.5rem' }}>
                {file ? file.name : 'Arrastra tu CV aquí o haz clic para seleccionar'}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Solo archivos PDF (máx. 5MB)</p>
            </div>
          </div>
          
          <div className="form-group">
            <label>📝 Descripción del Puesto</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Pega aquí la descripción del puesto que quieres evaluar..."
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '🔍 Analizando...' : '🎯 Analizar CV'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>📊 Resultado del Análisis</h3>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto',
              background: `conic-gradient(#667eea 0deg ${result.score * 3.6}deg, #e2e8f0 ${result.score * 3.6}deg 360deg)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                  {result.score}%
                </span>
                <span style={{ fontSize: '0.75rem', color: '#718096' }}>Compatibilidad</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-grid">
            <div>
              <h4 style={{ color: '#48bb78', marginBottom: '0.75rem' }}>✅ Fortalezas</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.strengths?.map((s, i) => (
                  <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>✓ {s}</li>
                ))}
              </ul>
              
              <h4 style={{ color: '#f56565', marginTop: '1rem', marginBottom: '0.75rem' }}>⚠️ Áreas de Mejora</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.weaknesses?.map((w, i) => (
                  <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>⚠ {w}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#ed8936', marginBottom: '0.75rem' }}>🎯 Habilidades Faltantes</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.missingSkills?.map((m, i) => (
                  <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>+ {m}</li>
                ))}
              </ul>
              
              <h4 style={{ color: '#4299e1', marginTop: '1rem', marginBottom: '0.75rem' }}>💡 Recomendaciones</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.recommendations?.map((r, i) => (
                  <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>💡 {r}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: '#f7fafc', 
            borderRadius: '0.75rem',
            borderLeft: '4px solid #667eea'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>📋 Resumen Ejecutivo</h4>
            <p style={{ color: '#4a5568' }}>{result.summary}</p>
          </div>

          {/* Botón de descarga PDF */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '30px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1rem'
              }}
            >
              📄 DESCARGAR REPORTE PDF ⬇️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Audit;