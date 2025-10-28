from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.sessions.models import Session

# Create your models here.

class Category(models.Model):
    """Modèle pour les catégories de produits"""
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    description = models.TextField(blank=True, verbose_name="Description")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Modèle pour les produits de l'e-shop"""
    name = models.CharField(max_length=200, verbose_name="Nom")
    description = models.TextField(verbose_name="Description")
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        verbose_name="Prix"
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products',
        verbose_name="Catégorie"
    )
    image = models.ImageField(
        upload_to='products/', 
        blank=True, 
        null=True,
        verbose_name="Image"
    )
    image_url = models.URLField(
        blank=True, 
        null=True,
        verbose_name="URL de l'image",
        help_text="URL de l'image du produit"
    )
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    is_available = models.BooleanField(default=True, verbose_name="Disponible")
    featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def is_in_stock(self):
        """Vérifie si le produit est en stock"""
        return self.stock > 0 and self.is_available


class Cart(models.Model):
    """Modèle pour le panier d'achat basé sur les sessions"""
    session_key = models.CharField(max_length=40, unique=True, verbose_name="Clé de session")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Panier"
        verbose_name_plural = "Paniers"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Panier {self.session_key[:8]}... ({self.items.count()} articles)"
    
    @property
    def total_items(self):
        """Retourne le nombre total d'articles dans le panier"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def total_price(self):
        """Retourne le prix total du panier"""
        return sum(item.total_price for item in self.items.all())
    
    @property
    def is_empty(self):
        """Vérifie si le panier est vide"""
        return not self.items.exists()


class CartItem(models.Model):
    """Modèle pour les articles du panier"""
    cart = models.ForeignKey(
        Cart, 
        on_delete=models.CASCADE, 
        related_name='items',
        verbose_name="Panier"
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE,
        verbose_name="Produit"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Quantité"
    )
    added_at = models.DateTimeField(auto_now_add=True, verbose_name="Ajouté le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Article du panier"
        verbose_name_plural = "Articles du panier"
        ordering = ['-added_at']
        unique_together = ['cart', 'product']  # Un produit par panier
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
    
    @property
    def total_price(self):
        """Retourne le prix total de cet article (quantité × prix unitaire)"""
        return self.quantity * self.product.price
    
    def clean(self):
        """Validation personnalisée"""
        if self.product and self.quantity > self.product.stock:
            from django.core.exceptions import ValidationError
            raise ValidationError(f"Stock insuffisant. Stock disponible: {self.product.stock}")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
