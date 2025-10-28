import React, { useState } from 'react';
import styled from 'styled-components';
import { FiShoppingCart, FiCheck, FiPlus, FiMinus } from 'react-icons/fi';
import { theme } from '../theme';
import { useCart } from '../hooks/useCart';

// Styles pour le bouton d'ajout au panier
const AddToCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${props => props.size === 'compact' ? theme.spacing.sm : theme.spacing.md} ${theme.spacing.lg};
  background: ${props => 
    props.disabled ? theme.colors.background.secondary :
    props.added ? theme.colors.success : theme.colors.primary.main
  };
  color: ${theme.colors.text.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  font-size: ${props => props.size === 'compact' ? '0.9rem' : '1rem'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: ${theme.transitions.normal};
  width: 100%;
  min-height: ${props => props.size === 'compact' ? '36px' : '44px'};
  
  &:hover:not(:disabled) {
    background: ${props => 
      props.added ? theme.colors.success : theme.colors.primary.dark
    };
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
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
  min-width: 20px;
  text-align: center;
`;

function AddToCartButton({ product, size = 'normal', showQuantityControls = false }) {
  const { cart, addToCart, updateCartItem, removeFromCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Vérifier si le produit est déjà dans le panier
  const cartItem = cart.items.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    
    try {
      const result = addToCart(product, 1);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        console.log('✅', result.message);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au panier:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateCartItem(product.id, newQuantity);
    }
  };

  // Si le produit est dans le panier et qu'on veut les contrôles de quantité
  if (isInCart && showQuantityControls) {
    return (
      <AddToCartContainer>
        <QuantityControls>
          <QuantityButton 
            onClick={() => handleUpdateQuantity(currentQuantity - 1)}
            disabled={currentQuantity <= 1}
          >
            <FiMinus size={14} />
          </QuantityButton>
          
          <QuantityDisplay>{currentQuantity}</QuantityDisplay>
          
          <QuantityButton 
            onClick={() => handleUpdateQuantity(currentQuantity + 1)}
          >
            <FiPlus size={14} />
          </QuantityButton>
        </QuantityControls>
      </AddToCartContainer>
    );
  }

  return (
    <AddToCartContainer>
      <AddButton
        onClick={handleAddToCart}
        disabled={isAdding}
        added={showSuccess}
        size={size}
      >
        {isAdding ? (
          <>
            <FiShoppingCart />
            Ajout...
          </>
        ) : showSuccess ? (
          <>
            <FiCheck />
            Ajouté !
          </>
        ) : isInCart ? (
          <>
            <FiCheck />
            Dans le panier ({currentQuantity})
          </>
        ) : (
          <>
            <FiShoppingCart />
            Ajouter au panier
          </>
        )}
      </AddButton>
    </AddToCartContainer>
  );
}

export default AddToCartButton;