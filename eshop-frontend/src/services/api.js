import axios from 'axios';

// Configuration de base pour l'API Django
const API_BASE_URL = 'http://localhost:8000/api';

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

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
};

export default api;