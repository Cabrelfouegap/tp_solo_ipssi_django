import React from 'react';

function SimpleTest() {
  return (
    <div style={{ 
      color: '#00ff41', 
      padding: '20px',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h1>🚀 CYBER SHOP TEST</h1>
      <p>Si vous voyez ce message, React fonctionne correctement !</p>
      <p>Serveur Django API : http://127.0.0.1:8000/api/</p>
      <p>Serveur React : http://localhost:5174/</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Tests à effectuer :</h3>
        <ul>
          <li>✅ React fonctionne</li>
          <li>⏳ Test de l'API en cours...</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleTest;