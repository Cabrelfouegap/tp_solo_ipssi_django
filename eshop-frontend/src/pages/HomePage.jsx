import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiStar, 
  FiArrowRight, 
  FiHeart,
  FiShoppingCart,
  FiTrendingUp,
  FiZap,
  FiAward
} from 'react-icons/fi';
import { 
  MdPhoneIphone, 
  MdLaptop, 
  MdGamepad, 
  MdHeadphones, 
  MdWatch 
} from 'react-icons/md';
import { theme } from '../theme';
import {
  AppContainer,
  Header,
  HeaderContent,
  Logo,
  Nav,
  NavLink,
  Main,
  SectionTitle,
  SectionSubtitle,
  Button,
  Card,
  LoadingSpinner,
  ErrorMessage
} from '../components/Layout';
import { apiService } from '../services/api';

// Hero section avec gradient moderne
const HeroSection = styled.section`
  background: ${theme.colors.primary.gradient};
  border-radius: ${theme.borderRadius.xxl};
  padding: ${theme.spacing.xxxxl} ${theme.spacing.xl};
  text-align: center;
  margin-bottom: ${theme.spacing.xxxxl};
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.hero};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="1"/></g></g></svg>');
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 4rem;
  font-weight: 800;
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.text.white};
  line-height: 1.1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 ${theme.spacing.xxl} 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 300;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled(Button)`
  background: ${theme.colors.text.white};
  color: ${theme.colors.primary.main};
  padding: ${theme.spacing.lg} ${theme.spacing.xxl};
  font-size: 1.125rem;
  font-weight: 600;
  border: 2px solid transparent;
  box-shadow: ${theme.shadows.lg};
  
  &:hover {
    background: ${theme.colors.background.secondary};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl};
  }
  
  &.secondary {
    background: transparent;
    color: ${theme.colors.text.white};
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

// Section des produits vedettes
const FeaturedSection = styled.section`
  margin-bottom: ${theme.spacing.xxxxl};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xxl};
`;

const ProductCard = styled(Card)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  position: relative;
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border.light};
  transition: ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.xl};
    border-color: ${theme.colors.primary.main};
    
    &::before {
      opacity: 1;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.background.card_hover};
    opacity: 0;
    transition: ${theme.transitions.normal};
    z-index: 0;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 220px;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x220/E2E8F0/6366F1?text=Image'});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg, 
      ${theme.colors.primary.main}10 0%, 
      transparent 50%, 
      ${theme.colors.accent.rose}10 100%
    );
    opacity: 0;
    transition: ${theme.transitions.normal};
  }
  
  ${ProductCard}:hover &::after {
    opacity: 1;
  }
`;

const ProductInfo = styled.div`
  position: relative;
  z-index: 1;
`;

const ProductCategory = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: ${theme.colors.primary.gradient};
  color: ${theme.colors.text.white};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
  box-shadow: ${theme.shadows.sm};
`;

const ProductName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text.primary};
  line-height: 1.3;
  position: relative;
  z-index: 1;
`;

const ProductDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 ${theme.spacing.lg} 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  position: relative;
  z-index: 1;
`;

const Price = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 1.75rem;
  font-weight: 800;
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ViewButton = styled(Button)`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: 0.9rem;
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.white};
  border: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  &:hover {
    background: ${theme.colors.primary.dark};
    box-shadow: ${theme.shadows.glow};
  }
`;

// Section des catégories
const CategoriesSection = styled.section`
  margin-bottom: ${theme.spacing.xxxxl};
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xxl};
`;

const CategoryCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  padding: ${theme.spacing.xl};
  position: relative;
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.border.light};
  transition: ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary.main};
    
    .category-icon {
      background: ${theme.colors.primary.gradient};
      color: ${theme.colors.text.white};
      transform: scale(1.1);
    }
  }
`;

const CategoryIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.lg} auto;
  font-size: 2rem;
  color: ${theme.colors.primary.main};
  transition: ${theme.transitions.normal};
  border: 2px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
  
  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const CategoryName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text.primary};
`;

const CategoryCount = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  margin: 0;
`;

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiService.getFeaturedProducts(),
          apiService.getCategories()
        ]);
        
        setFeaturedProducts(productsResponse.data.results || productsResponse.data);
        setCategories(categoriesResponse.data.results || categoriesResponse.data);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AppContainer>
        <Header>
          <HeaderContent>
            <Logo>
              <FiZap style={{ marginRight: '0.5rem', color: '#F59E0B' }} />
              TechShop
            </Logo>
            <Nav>
              <NavLink as={Link} to="/" className="active">
                <FiShoppingBag />
                Accueil
              </NavLink>
              <NavLink as={Link} to="/catalog">
                <FiShoppingCart />
                Catalogue
              </NavLink>
            </Nav>
          </HeaderContent>
        </Header>
        <Main>
          <LoadingSpinner />
        </Main>
      </AppContainer>
    );
  }

  if (error) {
    return (
      <AppContainer>
        <Header>
          <HeaderContent>
            <Logo>
              <FiZap style={{ marginRight: '0.5rem', color: '#F59E0B' }} />
              TechShop
            </Logo>
            <Nav>
              <NavLink as={Link} to="/" className="active">
                <FiShoppingBag />
                Accueil
              </NavLink>
              <NavLink as={Link} to="/catalog">
                <FiShoppingCart />
                Catalogue
              </NavLink>
            </Nav>
          </HeaderContent>
        </Header>
        <Main>
          <ErrorMessage>{error}</ErrorMessage>
        </Main>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <FiZap style={{ marginRight: '0.5rem', color: '#F59E0B' }} />
            TechShop
          </Logo>
          <Nav>
            <NavLink as={Link} to="/" className="active">
              <FiShoppingBag />
              Accueil
            </NavLink>
            <NavLink as={Link} to="/catalog">
              <FiShoppingCart />
              Catalogue
            </NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              <FiZap style={{ marginRight: '1rem', color: '#F59E0B' }} />
              TechShop Premium
            </HeroTitle>
            <HeroSubtitle>
              Découvrez notre collection exclusive de produits technologiques de pointe. 
              Des smartphones dernière génération aux accessoires gaming professionnels.
            </HeroSubtitle>
            <HeroButtons>
              <HeroButton as={Link} to="/catalog">
                <FiShoppingBag />
                Explorer le catalogue
                <FiArrowRight />
              </HeroButton>
              <HeroButton as={Link} to="/catalog?featured=true" className="secondary">
                <FiStar />
                Offres spéciales
              </HeroButton>
            </HeroButtons>
          </HeroContent>
        </HeroSection>

        {/* Produits vedettes */}
        <FeaturedSection>
          <SectionTitle>
            <FiTrendingUp style={{ marginRight: '1rem', color: '#6366F1' }} />
            Produits vedettes
          </SectionTitle>
          <SectionSubtitle>
            Découvrez notre sélection des meilleurs produits du moment, choisis par nos experts
          </SectionSubtitle>
          
          <ProductGrid>
            {featuredProducts.slice(0, 6).map(product => (
              <ProductCard 
                key={product.id} 
                as={Link} 
                to={`/product/${product.id}`}
              >
                <ProductImage src={product.image} />
                <ProductInfo>
                  <ProductCategory>
                    <FiAward />
                    {product.category_name}
                  </ProductCategory>
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductPrice>
                    <Price>{product.price} €</Price>
                    <ViewButton>
                      Voir le produit
                      <FiArrowRight />
                    </ViewButton>
                  </ProductPrice>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
        </FeaturedSection>

        {/* Catégories */}
        <CategoriesSection>
          <SectionTitle>Nos catégories</SectionTitle>
          <SectionSubtitle>
            Explorez nos différentes gammes de produits technologiques
          </SectionSubtitle>
          
          <CategoriesGrid>
            {categories.map(category => {
              // Fonction pour obtenir l'icône appropriée
              const getCategoryIcon = (categoryName) => {
                if (categoryName.includes('Smartphone')) return <MdPhoneIphone />;
                if (categoryName.includes('Ordinateur')) return <MdLaptop />;
                if (categoryName.includes('Gaming')) return <MdGamepad />;
                if (categoryName.includes('Audio')) return <MdHeadphones />;
                if (categoryName.includes('Montre')) return <MdWatch />;
                return <FiShoppingBag />; // Icône par défaut
              };

              return (
                <CategoryCard 
                  key={category.id} 
                  as={Link} 
                  to={`/catalog?category=${category.id}`}
                >
                  <CategoryIcon className="category-icon">
                    {getCategoryIcon(category.name)}
                  </CategoryIcon>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryCount>{category.product_count || 0} produits disponibles</CategoryCount>
                </CategoryCard>
              );
            })}
          </CategoriesGrid>
        </CategoriesSection>
      </Main>
    </AppContainer>
  );
}

export default HomePage;