import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages simples pour tester
function TestHomePage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>🏠 Page d'Accueil</h1>
      <p>Test de la page d'accueil sans CartProvider</p>
    </div>
  );
}

function TestCatalogPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>📱 Catalogue</h1>
      <p>Test de la page catalogue sans CartProvider</p>
    </div>
  );
}

function AppTestRouter() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <nav style={{ 
          backgroundColor: '#1976d2', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: 'white', margin: 0 }}>🛒 E-Shop Test</h1>
        </nav>
        
        <Routes>
          <Route path="/" element={<TestHomePage />} />
          <Route path="/catalog" element={<TestCatalogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppTestRouter;