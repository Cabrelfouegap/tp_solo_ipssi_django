import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiShoppingBag,
  FiShoppingCart,
  FiZap,
  FiGrid,
  FiTrendingUp
} from 'react-icons/fi';
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
  Button,
  Card,
  LoadingSpinner,
  ErrorMessage
} from '../components/Layout';
import { apiService } from '../services/api';

// Layout du catalogue
const CatalogLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 300px) 1fr;
  gap: ${theme.spacing.xxl};
  align-items: start;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
  
  @media (max-width: 320px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

// Sidebar des filtres
const FilterSidebar = styled.aside`
  position: sticky;
  top: 120px;
  min-width: 260px;
  max-width: 300px;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    position: static;
    min-width: auto;
    max-width: none;
  }
`;

const FilterCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  overflow: hidden; /* Empêche le débordement */
`;

const FilterTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text.primary};
`;

const FilterGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  font-size: 0.95rem;
  transition: ${theme.transitions.fast};
  
  &:hover {
    color: ${theme.colors.text.primary};
  }
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border-radius: ${theme.borderRadius.sm};
    border: 2px solid ${theme.colors.border.medium};
    background: ${theme.colors.background.card};
    cursor: pointer;
    
    &:checked {
      background: ${theme.colors.primary.main};
      border-color: ${theme.colors.primary.main};
    }
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  width: 100%;
`;

const PriceInput = styled.input`
  flex: 1;
  min-width: 0; /* Permet à flex de réduire la taille si nécessaire */
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.card};
  color: ${theme.colors.text.primary};
  font-size: 0.9rem;
  box-sizing: border-box; /* Inclut padding et border dans la largeur */
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
  }
  
  /* Amélioration pour les petits écrans */
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 0.8rem;
    padding: ${theme.spacing.xs};
  }
`;

const PriceSeparator = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: 500;
  flex-shrink: 0; /* Empêche le rétrécissement du séparateur */
  min-width: 20px;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  padding-left: ${theme.spacing.xxxxl};
  border: 2px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.background.card};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  margin-bottom: ${theme.spacing.lg};
  transition: ${theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${theme.colors.primary.main}20;
  }
  
  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  
  .search-icon {
    position: absolute;
    left: ${theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.text.secondary};
    font-size: 1.25rem;
    z-index: 1;
  }
`;

// Zone des produits
const ProductsSection = styled.section`
  min-height: 400px;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const ProductsCount = styled.p`
  color: ${theme.colors.text.secondary};
  margin: 0;
  font-size: 0.95rem;
`;

const SortSelect = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.card};
  color: ${theme.colors.text.primary};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
`;

const ProductCard = styled(Card)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.md};
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const PlaceholderProductImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, ${theme.colors.background.secondary}, ${theme.colors.background.tertiary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  font-size: 2rem;
`;

const ProductCategory = styled.span`
  display: inline-block;
  background: ${theme.colors.primary.light};
  color: ${theme.colors.primary.main};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProductName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text.primary};
  line-height: 1.3;
`;

const ProductDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 ${theme.spacing.md} 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Price = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.primary.main};
`;

const ClearFiltersButton = styled(Button)`
  width: 100%;
  padding: ${theme.spacing.sm};
  font-size: 0.9rem;
  margin-top: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  border: 2px solid ${theme.colors.border.medium};
  
  &:hover {
    background: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.primary.main};
    color: ${theme.colors.primary.main};
  }
`;

// Message quand aucun produit n'est trouvé
const NoProducts = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxxl};
  color: ${theme.colors.text.secondary};
  
  h3 {
    font-family: ${theme.fonts.heading};
    font-size: 1.5rem;
    margin: 0 0 ${theme.spacing.md} 0;
    color: ${theme.colors.text.primary};
  }
  
  p {
    margin: 0 0 ${theme.spacing.lg} 0;
    line-height: 1.6;
  }
`;

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('ordering') || 'name');

  // Charger les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response.data.results || response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Charger les produits quand les filtres changent
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (searchQuery) params.search = searchQuery;
        if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (sortBy) params.ordering = sortBy;
        
        const response = await apiService.getProducts(params);
        setProducts(response.data.results || response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategories, minPrice, maxPrice, sortBy]);

  // Gérer les changements de catégorie
  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    
    // Mettre à jour l'URL
    const newParams = new URLSearchParams(searchParams);
    if (newCategories.length > 0) {
      newParams.set('category', newCategories.join(','));
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  // Effacer tous les filtres
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSearchParams({});
  };

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
              <NavLink as={Link} to="/">
                <FiShoppingBag />
                Accueil
              </NavLink>
              <NavLink as={Link} to="/catalog" className="active">
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
              <NavLink as={Link} to="/">
                <FiShoppingBag />
                Accueil
              </NavLink>
              <NavLink as={Link} to="/catalog" className="active">
                <FiShoppingCart />
                Catalogue
              </NavLink>
            </Nav>
          </HeaderContent>
        </Header>      <Main>
        <SectionTitle>
          <FiGrid style={{ marginRight: '1rem', color: '#6366F1' }} />
          Catalogue produits
        </SectionTitle>
        
        <CatalogLayout>
          {/* Sidebar des filtres */}
          <FilterSidebar>
            <FilterCard>
              <SearchContainer>
                <FiSearch className="search-icon" />
                <SearchInput
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchContainer>
              
              <FilterGroup>
                <FilterTitle>
                  <FiFilter style={{ marginRight: '0.5rem' }} />
                  Catégories
                </FilterTitle>
                {categories.map(category => (
                  <FilterOption key={category.id}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id.toString())}
                      onChange={() => handleCategoryChange(category.id.toString())}
                    />
                    {category.name}
                  </FilterOption>
                ))}
              </FilterGroup>
              
              <FilterGroup>
                <FilterTitle>Prix (€)</FilterTitle>
                <PriceRange>
                  <PriceInput
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <PriceSeparator>-</PriceSeparator>
                  <PriceInput
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </PriceRange>
              </FilterGroup>
              
              <ClearFiltersButton 
                onClick={clearFilters}
              >
                <FiX />
                Effacer les filtres
              </ClearFiltersButton>
            </FilterCard>
          </FilterSidebar>

          {/* Zone des produits */}
          <ProductsSection>
            <ProductsHeader>
              <ProductsCount>
                {loading ? 'Chargement...' : `${products.length} produits trouvés`}
              </ProductsCount>
              
              <SortSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Nom A-Z</option>
                <option value="-name">Nom Z-A</option>
                <option value="price">Prix croissant</option>
                <option value="-price">Prix décroissant</option>
                <option value="-created_at">Plus récents</option>
              </SortSelect>
            </ProductsHeader>

            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <NoProducts>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou parcourez toutes nos catégories.</p>
                <Button onClick={clearFilters}>
                  Voir tous les produits
                </Button>
              </NoProducts>
            ) : (
              <ProductGrid>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    as={Link}
                    to={`/product/${product.id}`}
                  >
                    <ProductImage>
                      {product.image ? (
                        <img 
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            console.error('Erreur de chargement d\'image:', e.target.src);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <PlaceholderProductImage style={product.image ? {display: 'none'} : {}}>
                        📦
                      </PlaceholderProductImage>
                    </ProductImage>
                    <ProductCategory>{product.category_name}</ProductCategory>
                    <ProductName>{product.name}</ProductName>
                    <ProductDescription>{product.description}</ProductDescription>
                    <ProductPrice>
                      <Price>{product.price} €</Price>
                    </ProductPrice>
                  </ProductCard>
                ))}
              </ProductGrid>
            )}
          </ProductsSection>
        </CatalogLayout>
      </Main>
    </AppContainer>
  );
}

export default CatalogPage;