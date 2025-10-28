import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiShoppingCart, FiZap } from 'react-icons/fi';
import { theme } from '../theme';
import { useCart } from '../hooks/useCart';
import {
  Header,
  HeaderContent,
  Logo,
  Nav,
  NavLink
} from './Layout';

// Composant du panier dans le header
const CartIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border.light};
  transition: ${theme.transitions.normal};
  
  &:hover {
    background: ${theme.colors.background.secondary};
    border-color: ${theme.colors.primary.main};
    transform: translateY(-1px);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${theme.colors.accent.red};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.sm};
`;

const CartInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const CartCount = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.text.secondary};
`;

const CartTotal = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.primary.main};
`;

function HeaderWithCart() {
  const { cart } = useCart();

  return (
    <Header>
      <HeaderContent>
        <Logo>
          <FiZap style={{ marginRight: '0.5rem', color: '#F59E0B' }} />
          TechShop
        </Logo>
        
        <Nav>
          <NavLink as={Link} to="/">
            <FiShoppingBag />
            Accueil
          </NavLink>
          <NavLink as={Link} to="/catalog">
            <FiShoppingCart />
            Catalogue
          </NavLink>
          
          {/* Icône du panier avec badge */}
          <CartIcon as={Link} to="/cart">
            <FiShoppingCart size={20} />
            {cart.total_items > 0 && (
              <CartBadge>{cart.total_items}</CartBadge>
            )}
            <CartInfo>
              <CartCount>
                {cart.total_items} article{cart.total_items > 1 ? 's' : ''}
              </CartCount>
              <CartTotal>{cart.total_price.toFixed(2)} €</CartTotal>
            </CartInfo>
          </CartIcon>
        </Nav>
      </HeaderContent>
    </Header>
  );
}

export default HeaderWithCart;