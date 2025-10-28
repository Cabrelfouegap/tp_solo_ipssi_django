import React from 'react';

function AppSimple() {
  return (
    <div style={{
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1976d2', textAlign: 'center' }}>
        🛒 E-Shop - Version Simple
      </h1>
      
      <div style={{
        maxWidth: '800px',
        margin: '30px auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>✅ Application chargée avec succès !</h2>
        <p>Cette version simple fonctionne. Nous allons maintenant ajouter les fonctionnalités une par une.</p>
        
        <div style={{ marginTop: '30px' }}>
          <h3>🔧 Prochaines étapes :</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li>✅ React fonctionne</li>
            <li>🔄 Ajouter le routing</li>
            <li>🔄 Ajouter le CartProvider</li>
            <li>🔄 Ajouter les pages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AppSimple;