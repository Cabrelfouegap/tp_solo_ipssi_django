from rest_framework import serializers
from .models import Category, Product, Cart, CartItem


class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Category"""
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'products_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_products_count(self, obj):
        """Retourne le nombre de produits dans cette catégorie"""
        return obj.products.filter(is_available=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des produits (vue compacte)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'category', 'category_name', 
            'image', 'stock', 'is_available', 'featured', 'is_in_stock'
        ]
    
    def get_image(self, obj):
        """Retourne l'URL complète de l'image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer pour les détails d'un produit (vue complète)"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'category', 'category_id',
            'image', 'stock', 'is_available', 'featured', 'is_in_stock',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_in_stock']
    
    def get_image(self, obj):
        """Retourne l'URL complète de l'image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour créer/modifier un produit"""
    
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'category',
            'image', 'stock', 'is_available', 'featured'
        ]
    
    def validate_price(self, value):
        """Validation du prix"""
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être positif.")
        return value
    
    def validate_stock(self, value):
        """Validation du stock"""
        if value < 0:
            raise serializers.ValidationError("Le stock ne peut pas être négatif.")
        return value


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer pour les articles du panier"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()
    total_price = serializers.ReadOnlyField()
    product_stock = serializers.IntegerField(source='product.stock', read_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_name', 'product_price', 'product_image',
            'product_stock', 'quantity', 'total_price', 'added_at', 'updated_at'
        ]
        read_only_fields = ['id', 'added_at', 'updated_at']
    
    def get_product_image(self, obj):
        """Retourne l'URL complète de l'image du produit"""
        if obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        return None
    
    def validate(self, data):
        """Validation globale"""
        product = data.get('product')
        quantity = data.get('quantity', 1)
        
        if product and quantity > product.stock:
            raise serializers.ValidationError({
                'quantity': f'Stock insuffisant. Stock disponible: {product.stock}'
            })
        
        if product and not product.is_available:
            raise serializers.ValidationError({
                'product': 'Ce produit n\'est pas disponible.'
            })
        
        return data


class CartSerializer(serializers.ModelSerializer):
    """Serializer pour le panier"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    is_empty = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = [
            'id', 'session_key', 'items', 'total_items', 
            'total_price', 'is_empty', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'session_key', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    """Serializer pour ajouter un produit au panier"""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate_product_id(self, value):
        """Validation de l'ID du produit"""
        try:
            product = Product.objects.get(id=value)
            if not product.is_available:
                raise serializers.ValidationError("Ce produit n'est pas disponible.")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Produit introuvable.")


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer pour mettre à jour la quantité d'un article dans le panier"""
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_quantity(self, value):
        """Validation de la quantité"""
        cart_item = self.instance
        if cart_item and value > cart_item.product.stock:
            raise serializers.ValidationError(
                f'Stock insuffisant. Stock disponible: {cart_item.product.stock}'
            )
        return value