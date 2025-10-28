from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Supprime toutes les données existantes'

    def handle(self, *args, **options):
        self.stdout.write('🗑️ Suppression des données existantes...')
        
        # Suppression de tous les produits
        products_count = Product.objects.count()
        Product.objects.all().delete()
        self.stdout.write(f'✅ {products_count} produits supprimés')
        
        # Suppression de toutes les catégories
        categories_count = Category.objects.count()
        Category.objects.all().delete()
        self.stdout.write(f'✅ {categories_count} catégories supprimées')
        
        self.stdout.write('🎉 Base de données nettoyée avec succès!')