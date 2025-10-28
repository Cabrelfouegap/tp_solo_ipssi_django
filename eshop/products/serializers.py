from rest_framework import serializers
from .models import Category, Product


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