import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

// Styles simplifiés
const Container = styled.div`
  padding: 20px;
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  min-height: 50vh;
`;

const Title = styled.h1`
  color: ${theme.colors.primary.neonGreen};
  font-family: ${theme.fonts.primary};
  text-align: center;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: ${theme.effects.textShadow.neon};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductCard = styled.div`
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.primary.neonGreen};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  
  h3 {
    color: ${theme.colors.primary.neonGreen};
    margin: 0 0 10px 0;
  }
  
  p {
    color: ${theme.colors.text.secondary};
    margin: 5px 0;
  }
  
  .price {
    color: ${theme.colors.primary.neonYellow};
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const Status = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  
  &.loading {
    color: ${theme.colors.primary.neonYellow};
  }
  
  &.error {
    color: ${theme.colors.text.danger};
  }
  
  &.success {
    color: ${theme.colors.primary.neonGreen};
  }
`;

function HomePageSimple() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Tentative de connexion à l\'API...');
        
        // Test avec fetch simple
        const response = await fetch('http://localhost:8000/api/products/featured/', {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Data received:', data);
        
        setProducts(data);
        
      } catch (err) {
        console.error('❌ Erreur API:', err);
        setError(`Erreur de connexion: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container>
      <Title>CYBER SHOP</Title>
      
      {loading && (
        <Status className="loading">
          ⏳ Chargement des produits cyberpunk...
        </Status>
      )}
      
      {error && (
        <Status className="error">
          ❌ {error}
          <br />
          <small>Vérifiez que le serveur Django fonctionne sur http://127.0.0.1:8000/</small>
        </Status>
      )}
      
      {!loading && !error && products.length === 0 && (
        <Status className="error">
          ℹ️ Aucun produit trouvé
        </Status>
      )}
      
      {!loading && !error && products.length > 0 && (
        <>
          <Status className="success">
            ✅ {products.length} produits chargés avec succès !
          </Status>
          
          <ProductGrid>
            {products.map(product => (
              <ProductCard key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.category_name}</p>
                <p className="price">{product.price}€</p>
                <p>Stock: {product.stock}</p>
              </ProductCard>
            ))}
          </ProductGrid>
        </>
      )}
    </Container>
  );
}

export default HomePageSimple;