import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'

// Import progressif pour identifier le problème
import App from './App.jsx'

// Fonction de démarrage avec gestion d'erreur
function startApp() {
  try {
    const root = document.getElementById('root');
    if (!root) {
      document.body.innerHTML = '<h1 style="color: red; padding: 50px;">ERREUR: Element #root introuvable</h1>';
      return;
    }
    
    console.log('🚀 Démarrage de l\'application...');
    
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('✅ App démarrée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error);
    document.body.innerHTML = `
      <div style="padding: 50px; color: red; font-family: Arial; line-height: 1.6;">
        <h1>ERREUR REACT:</h1>
        <pre style="background: #f5f5f5; padding: 20px; border-radius: 5px;">${error.toString()}</pre>
        <p>Regardez la console pour plus de détails.</p>
      </div>
    `;
  }
}

// Démarrage sécurisé
startApp();
