import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme';
import { apiService } from '../services/api';
import { LoadingSpinner, ErrorMessage } from '../components/Layout';
import AppHeader from '../components/AppHeader';
import AddToCartButton from '../components/AddToCartButton';

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xxl};
  margin-top: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const ProductImageSection = styled.div`
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border.secondary};
  border-radius: 16px;
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border.secondary};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
  background: ${theme.colors.background.secondary};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${theme.colors.gradients.dark};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary.neonGreen};
  font-size: 8rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg at 50% 50%,
      ${theme.colors.primary.neonGreen}00 0deg,
      ${theme.colors.primary.neonGreen}30 90deg,
      ${theme.colors.primary.neonPurple}30 180deg,
      ${theme.colors.primary.neonYellow}30 270deg,
      ${theme.colors.primary.neonGreen}00 360deg
    );
    animation: rotate 15s linear infinite;
    z-index: 0;
  }
  
  &::after {
    content: '💎';
    position: relative;
    z-index: 1;
    text-shadow: ${theme.effects.textShadow.neon};
    filter: drop-shadow(0 0 20px ${theme.colors.primary.neonGreen});
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ProductInfoSection = styled.div`
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border.secondary};
  border-radius: 16px;
  padding: ${theme.spacing.xl};
`;

const ProductTitle = styled.h1`
  font-family: ${theme.fonts.primary};
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 ${theme.spacing.lg} 0;
  background: ${theme.colors.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: ${theme.effects.textShadow.neon};
`;

const ProductPrice = styled.div`
  font-family: ${theme.fonts.primary};
  font-size: 3rem;
  font-weight: 900;
  color: ${theme.colors.primary.neonYellow};
  margin: ${theme.spacing.lg} 0;
  text-shadow: ${theme.effects.textShadow.yellow};
`;

const ProductCategory = styled.div`
  background: ${theme.colors.primary.neonPurple}20;
  color: ${theme.colors.primary.neonPurple};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid ${theme.colors.primary.neonPurple};
  display: inline-block;
  margin-bottom: ${theme.spacing.lg};
`;

const ProductDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.lg} 0;
`;

const ProductSpecs = styled.div`
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border.secondary};
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.lg} 0;
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${theme.spacing.sm} 0;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border.secondary};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SpecLabel = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: 500;
`;

const SpecValue = styled.span`
  color: ${theme.colors.primary.neonGreen};
  font-weight: 600;
`;

const BackButton = styled(Link)`
  display: inline-block;
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: 8px;
  text-decoration: none;
  font-family: ${theme.fonts.secondary};
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid ${theme.colors.border.secondary};
  margin-bottom: ${theme.spacing.xl};
  
  &:hover {
    color: ${theme.colors.primary.neonGreen};
    border-color: ${theme.colors.primary.neonGreen};
    box-shadow: ${theme.effects.boxShadow.subtle};
  }
`;

const StockStatus = styled.div`
  font-weight: 600;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 6px;
  margin: ${theme.spacing.md} 0;
  
  ${props => props.inStock ? `
    background: ${theme.colors.primary.neonGreen}20;
    color: ${theme.colors.primary.neonGreen};
    border: 1px solid ${theme.colors.primary.neonGreen};
  ` : `
    background: ${theme.colors.text.danger}20;
    color: ${theme.colors.text.danger};
    border: 1px solid ${theme.colors.text.danger};
  `}
`;

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        setProduct(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!product) return <ErrorMessage>Produit non trouvé</ErrorMessage>;

  return (
    <div>
      <AppHeader />
      <div style={{ padding: theme.spacing.xl, maxWidth: '1200px', margin: '0 auto' }}>
        <BackButton to="/catalog">← Retour au catalogue</BackButton>
        
        <ProductContainer>
          <ProductImageSection>
            <ProductImageContainer>
              {product.image ? (
                <ProductImage 
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    console.error('Erreur de chargement d\'image:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <PlaceholderImage style={product.image ? {display: 'none'} : {}}>
              </PlaceholderImage>
            </ProductImageContainer>
            <StockStatus inStock={product.is_in_stock}>
              {product.is_in_stock ? 'EN STOCK' : 'RUPTURE DE STOCK'}
            </StockStatus>
          </ProductImageSection>

          <ProductInfoSection>
            <ProductCategory>{product.category.name}</ProductCategory>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductPrice>{product.price}€</ProductPrice>
            
            <ProductDescription>
              {product.description}
            </ProductDescription>

            {/* Bouton Ajouter au panier */}
            <AddToCartButton product={product} />

            <ProductSpecs>
              <h3 style={{ 
                color: theme.colors.primary.neonGreen, 
                fontFamily: theme.fonts.primary,
                marginTop: 0 
              }}>
                Spécifications
              </h3>
              <SpecItem>
                <SpecLabel>Référence</SpecLabel>
                <SpecValue>#{product.id.toString().padStart(6, '0')}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Stock disponible</SpecLabel>
                <SpecValue>{product.stock} unités</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Statut</SpecLabel>
                <SpecValue>
                  {product.is_available ? 'Disponible' : 'Indisponible'}
                </SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Produit phare</SpecLabel>
                <SpecValue>{product.featured ? 'Oui' : 'Non'}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Date d'ajout</SpecLabel>
                <SpecValue>
                  {new Date(product.created_at).toLocaleDateString('fr-FR')}
                </SpecValue>
              </SpecItem>
            </ProductSpecs>
          </ProductInfoSection>
        </ProductContainer>
      </div>
    </div>
  );
}

export default ProductPage;