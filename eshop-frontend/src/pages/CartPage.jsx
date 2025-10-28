import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import { theme } from '../theme';
import { useCart } from '../hooks/useCart';
import HeaderWithCart from '../components/Header';
import {
  AppContainer,
  Main,
  SectionTitle,
  Button,
  Card
} from '../components/Layout';

// Styles pour la page panier
const CartContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: ${theme.spacing.xxl};
  align-items: start;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const CartItem = styled(Card)`
  padding: ${theme.spacing.lg};
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: ${theme.spacing.lg};
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 80px 1fr;
    gap: ${theme.spacing.md};
  }
`;

const ProductImage = styled.div`
  width: 100px;
  height: 80px;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  background-image: url(${props => props.src || 'https://via.placeholder.com/100x80/E2E8F0/6366F1?text=Image'});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 80px;
    height: 60px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const ProductName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${theme.colors.text.primary};
`;

const ProductPrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.primary.main};
`;

const ProductCategory = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.text.secondary};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xs};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: ${theme.spacing.sm};
  }
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.white};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.primary.dark};
  }
  
  &:disabled {
    background: ${theme.colors.background.secondary};
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${theme.colors.text.primary};
  min-width: 30px;
  text-align: center;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${theme.colors.danger};
  color: ${theme.colors.text.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  
  &:hover {
    background: #dc2626;
    transform: scale(1.05);
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
    justify-self: end;
    margin-top: ${theme.spacing.sm};
  }
`;

const ItemTotal = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  text-align: right;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
    text-align: left;
    margin-top: ${theme.spacing.sm};
  }
`;

// Sidebar récapitulatif
const CartSummary = styled(Card)`
  padding: ${theme.spacing.xl};
  position: sticky;
  top: 120px;
  height: fit-content;
`;

const SummaryTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
    padding-top: ${theme.spacing.lg};
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  background: ${theme.colors.primary.gradient};
  padding: ${theme.spacing.lg};
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    box-shadow: ${theme.shadows.glow};
    transform: translateY(-2px);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxxl};
  color: ${theme.colors.text.secondary};
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  color: ${theme.colors.text.tertiary};
  margin-bottom: ${theme.spacing.xl};
`;

const ContinueShoppingButton = styled(Button)`
  background: ${theme.colors.background.card};
  color: ${theme.colors.primary.main};
  border: 2px solid ${theme.colors.primary.main};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    background: ${theme.colors.primary.main};
    color: ${theme.colors.text.white};
  }
`;

function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart();
    }
  };

  // Si le panier est vide
  if (cart.is_empty) {
    return (
      <AppContainer>
        <HeaderWithCart />
        <Main>
          <CartContainer>
            <SectionTitle>
              <FiShoppingCart style={{ marginRight: '1rem', color: '#6366F1' }} />
              Mon Panier
            </SectionTitle>
            
            <EmptyCart>
              <EmptyCartIcon>🛒</EmptyCartIcon>
              <h3>Votre panier est vide</h3>
              <p>Découvrez nos produits et ajoutez-les à votre panier !</p>
              <div style={{ marginTop: theme.spacing.xl }}>
                <ContinueShoppingButton as={Link} to="/catalog">
                  <FiArrowLeft />
                  Continuer les achats
                </ContinueShoppingButton>
              </div>
            </EmptyCart>
          </CartContainer>
        </Main>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <HeaderWithCart />
      <Main>
        <CartContainer>
          <SectionTitle>
            <FiShoppingCart style={{ marginRight: '1rem', color: '#6366F1' }} />
            Mon Panier ({cart.total_items} article{cart.total_items > 1 ? 's' : ''})
          </SectionTitle>

          <CartGrid>
            {/* Liste des articles */}
            <CartItems>
              {cart.items.map((item) => (
                <CartItem key={item.product.id}>
                  <ProductImage src={item.product.image} />
                  
                  <ProductInfo>
                    <ProductName>{item.product.name}</ProductName>
                    <ProductCategory>{item.product.category_name}</ProductCategory>
                    <ProductPrice>{item.product.price} € / unité</ProductPrice>
                  </ProductInfo>
                  
                  <QuantityControls>
                    <QuantityButton 
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus size={14} />
                    </QuantityButton>
                    
                    <QuantityDisplay>{item.quantity}</QuantityDisplay>
                    
                    <QuantityButton 
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <FiPlus size={14} />
                    </QuantityButton>
                  </QuantityControls>
                  
                  <ItemTotal>
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </ItemTotal>
                  
                  <RemoveButton 
                    onClick={() => handleRemoveItem(item.product.id)}
                    title="Supprimer cet article"
                  >
                    <FiTrash2 size={16} />
                  </RemoveButton>
                </CartItem>
              ))}
              
              {/* Actions sur le panier */}
              <div style={{ 
                display: 'flex', 
                gap: theme.spacing.md, 
                marginTop: theme.spacing.lg,
                flexWrap: 'wrap'
              }}>
                <ContinueShoppingButton as={Link} to="/catalog">
                  <FiArrowLeft />
                  Continuer les achats
                </ContinueShoppingButton>
                
                <Button 
                  onClick={handleClearCart}
                  style={{ 
                    background: theme.colors.danger,
                    color: theme.colors.text.white
                  }}
                >
                  <FiTrash2 />
                  Vider le panier
                </Button>
              </div>
            </CartItems>

            {/* Récapitulatif */}
            <CartSummary>
              <SummaryTitle>
                <FiCheckCircle />
                Récapitulatif
              </SummaryTitle>
              
              <SummaryRow>
                <span>Articles ({cart.total_items})</span>
                <span>{cart.total_price.toFixed(2)} €</span>
              </SummaryRow>
              
              <SummaryRow>
                <span>Livraison</span>
                <span>Gratuite</span>
              </SummaryRow>
              
              <SummaryRow>
                <span>Total</span>
                <span>{cart.total_price.toFixed(2)} €</span>
              </SummaryRow>
              
              <CheckoutButton>
                <FiCheckCircle />
                Procéder au paiement
                <FiArrowRight />
              </CheckoutButton>
            </CartSummary>
          </CartGrid>
        </CartContainer>
      </Main>
    </AppContainer>
  );
}

export default CartPage;