// Thème moderne et attractif avec gradients
export const theme = {
  colors: {
    // Couleurs principales avec gradients modernes
    primary: {
      main: '#6366F1',        // Indigo vibrant
      light: '#A5B4FC',       // Indigo clair
      dark: '#4338CA',        // Indigo foncé
      accent: '#EC4899',      // Rose accent
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
    },
    
    // Couleurs secondaires
    secondary: {
      main: '#8B5CF6',        // Violet
      light: '#C4B5FD',       // Violet clair
      dark: '#7C3AED',        // Violet foncé
    },
    
    // Couleurs d'accent modernes
    accent: {
      cyan: '#06B6D4',        // Cyan moderne
      emerald: '#10B981',     // Emerald
      amber: '#F59E0B',       // Amber
      rose: '#EC4899',        // Rose
    },
    
    // Couleurs de fond avec gradients
    background: {
      primary: '#FFFFFF',     // Blanc pur
      secondary: '#F8FAFC',   // Gris très clair
      tertiary: '#F1F5F9',    // Gris clair
      card: '#FFFFFF',        // Cartes blanches
      dark: '#0F172A',        // Fond sombre
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hero: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
      card_hover: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
    },
    
    // Couleurs de texte
    text: {
      primary: '#0F172A',     // Noir moderne
      secondary: '#475569',   // Gris moyen
      tertiary: '#64748B',    // Gris clair
      white: '#FFFFFF',       // Blanc
      muted: '#94A3B8',       // Gris très clair
      accent: '#6366F1',      // Bleu accent
    },
    
    // Couleurs de bordure
    border: {
      light: '#E2E8F0',       // Gris très clair
      medium: '#CBD5E1',      // Gris clair
      dark: '#94A3B8',        // Gris moyen
      accent: '#6366F1',      // Bordure accent
    },
    
    // Couleurs système
    success: '#10B981',       // Vert moderne
    error: '#EF4444',         // Rouge moderne
    warning: '#F59E0B',       // Orange moderne
    info: '#3B82F6',          // Bleu info
  },
  
  // Polices modernes
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  
  // Espacements harmonieux
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    xxl: '3rem',      // 48px
    xxxl: '4rem',     // 64px
    xxxxl: '6rem',    // 96px
  },
  
  // Rayons de bordure
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    xxl: '1.5rem',    // 24px
    full: '9999px',   // Cercle
  },
  
  // Ombres modernes et attractives
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card: '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
    hero: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  
  // Points de rupture responsive
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
  
  // Transitions fluides
  transitions: {
    fast: 'all 0.15s ease-in-out',
    normal: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out',
  },
  
  // Z-index organisation
  zIndex: {
    dropdown: 1000,
    modal: 1100,
    popover: 1200,
    tooltip: 1300,
    header: 100,
  },
};