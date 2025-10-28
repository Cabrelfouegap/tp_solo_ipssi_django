from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Product, Cart, CartItem
from .serializers import (
    CategorySerializer, 
    ProductListSerializer, 
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    CartSerializer,
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les catégories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Retourne les produits d'une catégorie"""
        category = self.get_object()
        products = Product.objects.filter(
            category=category, 
            is_available=True
        ).order_by('-created_at')
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les produits"""
    queryset = Product.objects.select_related('category').all()
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_available', 'featured']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['name', 'price', 'created_at', 'stock']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Choisit le serializer selon l'action"""
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer
    
    def get_queryset(self):
        """Filtrage personnalisé des produits"""
        queryset = super().get_queryset()
        
        # Filtre par prix minimum et maximum
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass
        
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass
        
        # Filtre pour les produits en stock seulement
        in_stock_only = self.request.query_params.get('in_stock_only')
        if in_stock_only and in_stock_only.lower() == 'true':
            queryset = queryset.filter(stock__gt=0, is_available=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Retourne les produits mis en avant"""
        featured_products = self.get_queryset().filter(
            featured=True, 
            is_available=True
        )[:6]  # Limite à 6 produits
        
        serializer = ProductListSerializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search_advanced(self, request):
        """Recherche avancée avec plusieurs critères"""
        query = request.query_params.get('q', '')
        category_slug = request.query_params.get('category')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        
        queryset = self.get_queryset()
        
        # Recherche textuelle
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query) |
                Q(category__name__icontains=query)
            )
        
        # Filtre par catégorie
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filtres de prix
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass
        
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProductListSerializer(queryset, many=True)
        return Response(serializer.data)


class CartViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer le panier d'achat"""
    serializer_class = CartSerializer
    
    def get_queryset(self):
        """Retourne le panier de la session courante"""
        session_key = self.request.session.session_key
        if not session_key:
            self.request.session.create()
            session_key = self.request.session.session_key
        
        return Cart.objects.filter(session_key=session_key)
    
    def get_or_create_cart(self):
        """Récupère ou crée le panier pour la session courante"""
        session_key = self.request.session.session_key
        if not session_key:
            self.request.session.create()
            session_key = self.request.session.session_key
        
        cart, created = Cart.objects.get_or_create(session_key=session_key)
        return cart
    
    def list(self, request):
        """Retourne le panier de l'utilisateur"""
        cart = self.get_or_create_cart()
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Ajoute un produit au panier"""
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            cart = self.get_or_create_cart()
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']
            
            try:
                product = Product.objects.get(id=product_id)
                
                # Vérifier le stock
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart,
                    product=product,
                    defaults={'quantity': quantity}
                )
                
                if not created:
                    # Article déjà dans le panier, augmenter la quantité
                    new_quantity = cart_item.quantity + quantity
                    if new_quantity > product.stock:
                        return Response({
                            'error': f'Stock insuffisant. Stock disponible: {product.stock}, '
                                   f'quantité dans le panier: {cart_item.quantity}'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    cart_item.quantity = new_quantity
                    cart_item.save()
                
                # Retourner le panier mis à jour
                cart_serializer = CartSerializer(cart, context={'request': request})
                return Response({
                    'message': f'{product.name} ajouté au panier',
                    'cart': cart_serializer.data
                }, status=status.HTTP_201_CREATED)
                
            except Product.DoesNotExist:
                return Response({
                    'error': 'Produit introuvable'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'])
    def update_item(self, request):
        """Met à jour la quantité d'un article dans le panier"""
        cart = self.get_or_create_cart()
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response({
                'error': 'item_id requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            serializer = UpdateCartItemSerializer(cart_item, data=request.data)
            
            if serializer.is_valid():
                cart_item.quantity = serializer.validated_data['quantity']
                cart_item.save()
                
                cart_serializer = CartSerializer(cart, context={'request': request})
                return Response({
                    'message': 'Quantité mise à jour',
                    'cart': cart_serializer.data
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Article introuvable dans le panier'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Supprime un article du panier"""
        cart = self.get_or_create_cart()
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response({
                'error': 'item_id requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            product_name = cart_item.product.name
            cart_item.delete()
            
            cart_serializer = CartSerializer(cart, context={'request': request})
            return Response({
                'message': f'{product_name} supprimé du panier',
                'cart': cart_serializer.data
            })
            
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Article introuvable dans le panier'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Vide complètement le panier"""
        cart = self.get_or_create_cart()
        cart.items.all().delete()
        
        cart_serializer = CartSerializer(cart, context={'request': request})
        return Response({
            'message': 'Panier vidé',
            'cart': cart_serializer.data
        })
