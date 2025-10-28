import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiShoppingBag, 
  FiZap,
  FiCheck,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiChevronRight,
  FiStar,
  FiArrowLeft
} from 'react-icons/fi';
import { theme } from '../theme';
import HeaderWithCart from '../components/Header';
import AddToCartButton from '../components/AddToCartButton';
import {
  AppContainer,
  Main,
  Button,
  Card,
  LoadingSpinner,
  ErrorMessage
} from '../components/Layout';
import { apiService } from '../services/api';

// Layout de la page produit
const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xxxxl};
  margin-bottom: ${theme.spacing.xxxxl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xxl};
  }
`;

// Section image
const ImageSection = styled.div`
  position: sticky;
  top: 120px;
  height: fit-content;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    position: static;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 500px;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.xl};
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.card};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 300px;
  }
`;

// Section informations
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  font-size: 0.9rem;
  color: ${theme.colors.text.secondary};
  
  .breadcrumb-icon {
    color: ${theme.colors.primary.main};
  }
`;

const BreadcrumbLink = styled(Link)`
  color: ${theme.colors.primary.main};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled(FiChevronRight)`
  color: ${theme.colors.border.medium};
  font-size: 0.875rem;
`;

const ProductCategory = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: ${theme.colors.primary.gradient};
  color: ${theme.colors.text.white};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};
`;

const ProductTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.text.primary};
  line-height: 1.2;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const ProductPrice = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 800;
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const ProductDescription = styled.div`
  color: ${theme.colors.text.secondary};
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: ${theme.spacing.xl};
  
  p {
    margin: 0 0 ${theme.spacing.md} 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ProductFeatures = styled(Card)`
  margin-bottom: ${theme.spacing.xl};
`;

const FeaturesTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.text.primary};
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border.light};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: '✓';
    color: ${theme.colors.success};
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing.xl};
`;

const WishlistButton = styled(Button)`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  background: ${theme.colors.background.card};
  color: ${theme.colors.text.primary};
  border: 2px solid ${theme.colors.border.medium};
  
  &:hover {
    background: ${theme.colors.background.secondary};
    border-color: ${theme.colors.accent.rose};
    color: ${theme.colors.accent.rose};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex: 1;
  }
`;

const ProductInfo = styled(Card)`
  margin-bottom: ${theme.spacing.xl};
`;

const InfoTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.text.primary};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

const InfoItem = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.light};
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

// Section produits similaires
const SimilarProducts = styled.section`
  margin-top: ${theme.spacing.xxxxl};
  padding-top: ${theme.spacing.xxxxl};
  border-top: 1px solid ${theme.colors.border.light};
`;

const SimilarTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 ${theme.spacing.xxl} 0;
  color: ${theme.colors.text.primary};
  text-align: center;
`;

const SimilarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
`;

const SimilarCard = styled(Card)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  padding: ${theme.spacing.lg};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const SimilarImage = styled.div`
  width: 100%;
  height: 150px;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const SimilarName = styled.h4`
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text.primary};
`;

const SimilarPrice = styled.div`
  font-family: ${theme.fonts.heading};
  font-weight: 700;
  color: ${theme.colors.primary.main};
`;

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        setProduct(response.data);
        
        // Charger les produits similaires (même catégorie)
        if (response.data.category) {
          const similarResponse = await apiService.getProducts({
            category: response.data.category,
            limit: 4
          });
          setSimilarProducts(
            (similarResponse.data.results || similarResponse.data)
              .filter(p => p.id !== parseInt(id))
              .slice(0, 3)
          );
        }
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError('Produit non trouvé ou erreur de chargement.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <AppContainer>
        <HeaderWithCart />
        <Main>
          <LoadingSpinner />
        </Main>
      </AppContainer>
    );
  }

  if (error || !product) {
    return (
      <AppContainer>
        <HeaderWithCart />
        <Main>
          <ErrorMessage>{error}</ErrorMessage>
          <Button as={Link} to="/catalog">
            Retour au catalogue
          </Button>
        </Main>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <HeaderWithCart />

      <Main>
        <Breadcrumb>
          <BreadcrumbLink to="/">
            <FiShoppingBag className="breadcrumb-icon" />
            Accueil
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink to="/catalog">Catalogue</BreadcrumbLink>
          <BreadcrumbSeparator />
          <span>{product.name}</span>
        </Breadcrumb>

        <ProductLayout>
          <ImageSection>
            <ProductImage src={product.image} />
          </ImageSection>

          <InfoSection>
            <div>
              <ProductCategory>
                <FiStar />
                {product.category_name}
              </ProductCategory>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductPrice>
                <FiZap style={{ color: '#F59E0B' }} />
                {product.price} €
              </ProductPrice>
            </div>

            <ProductDescription>
              <p>{product.description}</p>
            </ProductDescription>

            <ActionButtons>
              <div style={{ flex: 1 }}>
                <AddToCartButton 
                  product={product} 
                  size="normal" 
                  showQuantityControls={true} 
                />
              </div>
              
              <WishlistButton>
                <FiHeart />
                Favoris
              </WishlistButton>
            </ActionButtons>

            <ProductFeatures>
              <FeaturesTitle>
                <FiCheck style={{ marginRight: '0.5rem', color: '#10B981' }} />
                Avantages inclus
              </FeaturesTitle>
              <FeaturesList>
                <FeatureItem>
                  <FiTruck style={{ marginRight: '0.5rem', color: '#10B981' }} />
                  Livraison gratuite
                </FeatureItem>
                <FeatureItem>
                  <FiShield style={{ marginRight: '0.5rem', color: '#10B981' }} />
                  Garantie 2 ans
                </FeatureItem>
                <FeatureItem>
                  <FiRefreshCw style={{ marginRight: '0.5rem', color: '#10B981' }} />
                  Retour sous 30 jours
                </FeatureItem>
                <FeatureItem>
                  <FiHeadphones style={{ marginRight: '0.5rem', color: '#10B981' }} />
                  Support technique inclus
                </FeatureItem>
              </FeaturesList>
            </ProductFeatures>

            <ProductInfo>
              <InfoTitle>Informations produit</InfoTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Catégorie</InfoLabel>
                  <InfoValue>{product.category_name}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Disponibilité</InfoLabel>
                  <InfoValue>En stock</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>SKU</InfoLabel>
                  <InfoValue>TECH-{product.id.toString().padStart(4, '0')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Livraison</InfoLabel>
                  <InfoValue>2-3 jours ouvrés</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ProductInfo>
          </InfoSection>
        </ProductLayout>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <SimilarProducts>
            <SimilarTitle>Produits similaires</SimilarTitle>
            <SimilarGrid>
              {similarProducts.map(similarProduct => (
                <SimilarCard
                  key={similarProduct.id}
                  as={Link}
                  to={`/product/${similarProduct.id}`}
                >
                  <SimilarImage src={similarProduct.image} />
                  <SimilarName>{similarProduct.name}</SimilarName>
                  <SimilarPrice>{similarProduct.price} €</SimilarPrice>
                </SimilarCard>
              ))}
            </SimilarGrid>
          </SimilarProducts>
        )}
      </Main>
    </AppContainer>
  );
}

export default ProductDetailPage;