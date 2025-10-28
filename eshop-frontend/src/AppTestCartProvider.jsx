import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProviderSafe } from './context/CartContextSafe';

// Pages simples pour tester
function TestHomePage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>🏠 Page d'Accueil</h1>
      <p>Test avec CartProvider simplifié</p>
      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        ✅ CartProvider fonctionne !
      </div>
    </div>
  );
}

function TestCatalogPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>📱 Catalogue</h1>
      <p>Test de la page catalogue avec CartProvider</p>
    </div>
  );
}

function AppTestCartProvider() {
  console.log('AppTestCartProvider: Rendu de l\'app...');
  
  return (
    <CartProviderSafe>
      <Router>
        <div style={{ backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
          <nav style={{ 
            backgroundColor: '#1976d2', 
            padding: '20px',
            textAlign: 'center'
          }}>
            <h1 style={{ color: 'white', margin: 0 }}>🛒 E-Shop + CartProvider</h1>
          </nav>
          
          <Routes>
            <Route path="/" element={<TestHomePage />} />
            <Route path="/catalog" element={<TestCatalogPage />} />
          </Routes>
        </div>
      </Router>
    </CartProviderSafe>
  );
}

export default AppTestCartProvider;