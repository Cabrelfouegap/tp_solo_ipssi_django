import axios from 'axios';

// Configuration de base pour l'API Django
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les logs en mode debug
if (DEBUG_MODE) {
  api.interceptors.request.use(
    (config) => {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
      return config;
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('❌ API Error:', error.response?.status, error.config?.url);
      return Promise.reject(error);
    }
  );
}

// Services API
export const apiService = {
  // Catégories
  getCategories: () => api.get('/categories/'),
  getCategory: (slug) => api.get(`/categories/${slug}/`),
  getCategoryProducts: (slug) => api.get(`/categories/${slug}/products/`),

  // Produits
  getProducts: (params = {}) => api.get('/products/', { params }),
  getProduct: (id) => api.get(`/products/${id}/`),
  getFeaturedProducts: () => api.get('/products/featured/'),
  searchProducts: (params) => api.get('/products/search_advanced/', { params }),

  // Filtres utiles
  getProductsByCategory: (categoryId) => 
    api.get('/products/', { params: { category: categoryId } }),
  
  getProductsByPriceRange: (minPrice, maxPrice) => 
    api.get('/products/', { params: { min_price: minPrice, max_price: maxPrice } }),
  
  searchProductsByText: (query) => 
    api.get('/products/', { params: { search: query } }),

  // Panier
  getCart: () => api.get('/cart/'),
  addToCart: (productId, quantity = 1) => 
    api.post('/cart/add_item/', { product_id: productId, quantity }),
  updateCartItem: (itemId, quantity) => 
    api.put('/cart/update_item/', { item_id: itemId, quantity }),
  removeFromCart: (itemId) => 
    api.delete('/cart/remove_item/', { data: { item_id: itemId } }),
  clearCart: () => api.delete('/cart/clear/'),
};

export default api;