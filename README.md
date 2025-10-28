# TechShop E-commerce Platform

TechShop est une plateforme e-commerce complète conçue pour la vente de produits high-tech. L'application offre une expérience utilisateur moderne avec une interface responsive et des fonctionnalités avancées de gestion de catalogue et de panier.

# Objectifs du projet
- Démonstration d'une architecture full-stack moderne
- Implémentation des meilleures pratiques Django REST Framework
- Interface utilisateur responsive avec React et Styled Components
- Gestion d'état sophistiquée avec Context API
- API RESTful complète avec documentation

# Fonctionnalités

# utilisateur
- Catalogue de produits : Affichage avec pagination et filtres avancés
- Recherche intelligente : Recherche textuelle et filtrage par catégorie/prix
- Panier d'achat : Gestion complète avec persistance locale
- Interface responsive : Optimisée pour desktop, tablette et mobile
- Navigation fluide : Single Page Application avec React Router

# Côté administration
- Interface d'administration Django : Gestion complète des produits et catégories
- API REST complète : Endpoints pour toutes les opérations CRUD
- Gestion des médias : Support des images produits
- Commands Django personnalisées : Scripts de gestion des données

## 🏗️ Architecture technique

### Stack technologique

#### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| **Django** | 5.2.7 | Framework web principal |
| **Django REST Framework** | 3.15.2 | API REST et sérialisations |
| **django-cors-headers** | 4.4.0 | Gestion CORS pour SPA |
| **python-dotenv** | 1.0.0 | Variables d'environnement |
| **SQLite** | 3.x | Base de données (dev) |

#### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| **React** | 18.3.1 | Bibliothèque UI |
| **Vite** | 5.x | Build tool et dev server |
| **React Router** | 6.x | Navigation SPA |
| **Styled Components** | 6.x | CSS-in-JS |
| **Axios** | 1.x | Client HTTP |
| **React Icons** | 5.x | Bibliothèque d'icônes |


### Installation manuelle

#### 1. Configuration du Backend

```bash
# Cloner et naviguer
git clone https://github.com/Cabrelfouegap/tp_solo_ipssi_django.git
cd django_learn/eshop

# Environnement virtuel 
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# Installation des dépendances
pip install -r requirements.txt

# Configuration de la base de données
python manage.py migrate
python manage.py 

# Démarrage du serveur
python manage.py runserver localhost:5000
```

#### 2. Configuration du Frontend

```bash
# Nouveau terminal - naviguer vers le frontend
cd ../eshop-frontend

# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

### Accès à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000/api



#### Frontend (`eshop-frontend/.env`)
```env
# URL de l'API backend
VITE_API_BASE_URL=http://localhost:5000/api

# Configuration de l'application
VITE_APP_NAME=TechShop
VITE_DEBUG_MODE=true
```


## Documentation API

### Endpoints principaux

#### Catégories
```http
GET    /api/categories/           # Liste des catégories
GET    /api/categories/{slug}/    # Détail d'une catégorie
```

#### Produits
```http
GET    /api/products/             # Liste des produits (avec filtres)
GET    /api/products/{id}/        # Détail d'un produit
GET    /api/products/featured/    # Produits mis en avant
```

#### Panier
```http
GET    /api/cart/                 # Contenu du panier
POST   /api/cart/add_item/        # Ajouter un article
PUT    /api/cart/update_item/     # Modifier la quantité
DELETE /api/cart/remove_item/     # Supprimer un article
DELETE /api/cart/clear/           # Vider le panier
```

### Paramètres de requête

#### Filtrage des produits
| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `search` | string | Recherche textuelle | `?search=smartphone` |
| `category` | int/string | Filtrer par catégorie | `?category=electronics` |
| `min_price` | decimal | Prix minimum | `?min_price=100` |
| `max_price` | decimal | Prix maximum | `?max_price=500` |
| `ordering` | string | Tri des résultats | `?ordering=-price` |
| `page` | int | Numéro de page | `?page=2` |

#### Options de tri
- `name` : Nom A-Z
- `-name` : Nom Z-A  
- `price` : Prix croissant
- `-price` : Prix décroissant
- `created_at` : Plus ancien
- `-created_at` : Plus récent

### Exemples de requêtes

```bash
# Rechercher des smartphones entre 200€ et 800€
curl "http://localhost:5000/api/products/?search=smartphone&min_price=200&max_price=800"

# Produits d'une catégorie, triés par prix décroissant
curl "http://localhost:5000/api/products/?category=electronics&ordering=-price"

# Ajouter un produit au panier
curl -X POST http://localhost:5000/api/cart/add_item/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

## Tests et qualité

### Tests backend
```bash
# Lancer tous les tests
python manage.py test

# Tests avec couverture
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Tests frontend
```bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Tests E2E (si configurés)
npm run test:e2e
```