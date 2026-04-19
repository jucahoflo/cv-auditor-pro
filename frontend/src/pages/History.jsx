import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/audit/history');
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>📜 Historial de Auditorías</h2>
        {history.length === 0 ? (
          <p>No tienes auditorías realizadas aún.</p>
        ) : (
          history.map((item, index) => (
            <div key={index} style={{ 
              borderBottom: '1px solid #e2e8f0', 
              padding: '1rem 0',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{item.fileName}</strong>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  {item.score}%
                </div>
              </div>
              <details>
                <summary style={{ cursor: 'pointer', color: '#667eea', marginTop: '0.5rem' }}>
                  Ver detalles
                </summary>
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f7fafc', borderRadius: '5px' }}>
                  <p><strong>Puesto:</strong> {item.jobDescription.substring(0, 100)}...</p>
                  <p><strong>Resumen:</strong> {item.result?.summary}</p>
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;