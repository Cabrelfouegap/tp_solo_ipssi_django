import styled from 'styled-components';
import { theme } from '../theme';

// Container principal moderne
export const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
`;

// Header moderne et épuré
export const Header = styled.header`
  background: ${theme.colors.background.card};
  border-bottom: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.95);
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: ${theme.transitions.fast};
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.md};
  }
`;

export const NavLink = styled.a`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  font-family: ${theme.fonts.primary};
  font-weight: 500;
  font-size: 1rem;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.primary.main};
    background: ${theme.colors.background.secondary};
    transform: translateY(-1px);
  }
  
  &.active {
    color: ${theme.colors.primary.main};
    background: ${theme.colors.primary.light};
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: ${theme.colors.primary.gradient};
      border-radius: ${theme.borderRadius.full};
    }
  }
`;

// Main content
export const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  min-height: calc(100vh - 200px);
`;

// Section title moderne
export const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 ${theme.spacing.xl} 0;
  color: ${theme.colors.text.primary};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${theme.spacing.xxl} 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

// Bouton moderne avec gradients
export const Button = styled.button`
  background: ${theme.colors.primary.gradient};
  color: ${theme.colors.text.white};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.fonts.primary};
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: ${theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.md};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.secondary {
    background: ${theme.colors.background.card};
    color: ${theme.colors.text.primary};
    border: 2px solid ${theme.colors.border.medium};
    box-shadow: ${theme.shadows.sm};
    
    &:hover {
      background: ${theme.colors.background.secondary};
      border-color: ${theme.colors.primary.main};
      color: ${theme.colors.primary.main};
    }
  }
`;

// Card moderne
export const Card = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.card};
  border: 1px solid ${theme.colors.border.light};
  transition: ${theme.transitions.normal};
  
  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

// Loading spinner moderne
export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border.light};
  border-top: 3px solid ${theme.colors.primary.main};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: ${theme.spacing.xl} auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Message d'erreur moderne
export const ErrorMessage = styled.div`
  background: ${theme.colors.error}10;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.lg} 0;
  color: ${theme.colors.error};
  text-align: center;
  font-weight: 500;
`;

// Message de succès
export const SuccessMessage = styled.div`
  background: ${theme.colors.success}10;
  border: 1px solid ${theme.colors.success}30;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.lg} 0;
  color: ${theme.colors.success};
  text-align: center;
  font-weight: 500;
`;

// Footer moderne
export const Footer = styled.footer`
  background: ${theme.colors.background.secondary};
  border-top: 1px solid ${theme.colors.border.light};
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  margin-top: auto;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
`;