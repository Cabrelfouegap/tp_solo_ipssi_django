import React, { useState, useEffect } from 'react';

function ApiTest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('🔍 Test de l\'API...');
        
        // Test simple avec fetch pour éviter les problèmes d'axios
        const response = await fetch('http://127.0.0.1:8000/api/products/');
        console.log('📊 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 Data received:', result);
        setData(result);
        
      } catch (err) {
        console.error('❌ API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) return <div style={{color: '#00ff41', padding: '20px'}}>⏳ Chargement...</div>;
  if (error) return <div style={{color: '#ff0040', padding: '20px'}}>❌ Erreur: {error}</div>;

  return (
    <div style={{color: '#ffffff', padding: '20px', backgroundColor: '#1a1a1a'}}>
      <h2 style={{color: '#00ff41'}}>🧪 Test API</h2>
      <pre style={{backgroundColor: '#0a0a0a', padding: '10px', borderRadius: '5px', fontSize: '12px'}}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default ApiTest;