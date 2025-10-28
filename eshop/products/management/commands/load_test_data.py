from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Ajoute des données de test pour l\'e-shop cyberpunk'

    def handle(self, *args, **options):
        self.stdout.write('🚀 Création des données de test...')
        
        # Création des catégories
        categories_data = [
            {
                'name': 'Cyberware',
                'description': 'Implants cybernétiques et modifications corporelles',
                'slug': 'cyberware'
            },
            {
                'name': 'Vêtements Tech',
                'description': 'Vêtements futuristes et équipements tactiques',
                'slug': 'vetements-tech'
            },
            {
                'name': 'Gadgets',
                'description': 'Gadgets électroniques et accessoires high-tech',
                'slug': 'gadgets'
            },
            {
                'name': 'Armes',
                'description': 'Armement futuriste et équipements de combat',
                'slug': 'armes'
            }
        ]
        
        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(f'✅ Catégorie créée: {category.name}')
        
        # Création des produits
        products_data = [
            # Cyberware
            {
                'name': 'Neural Interface X1',
                'description': 'Interface neurale de dernière génération permettant une connexion directe au réseau. Compatible avec tous les implants Kiroshi.',
                'price': 2500.00,
                'category': 'cyberware',
                'stock': 15,
                'featured': True
            },
            {
                'name': 'Kiroshi Optics Mk.3',
                'description': 'Implants oculaires haut de gamme avec zoom x50, vision nocturne et analyse de données en temps réel.',
                'price': 3200.00,
                'category': 'cyberware',
                'stock': 8,
                'featured': True
            },
            {
                'name': 'Mantis Blades',
                'description': 'Lames rétractables implantées dans les avant-bras. Acier carbone mono-moléculaire.',
                'price': 4500.00,
                'category': 'cyberware',
                'stock': 5,
                'featured': False
            },
            
            # Vêtements Tech
            {
                'name': 'Veste Arasaka Corporate',
                'description': 'Veste corporative blindée avec protection ballistique niveau III et système de refroidissement intégré.',
                'price': 890.00,
                'category': 'vetements-tech',
                'stock': 25,
                'featured': True
            },
            {
                'name': 'Combinaison Netrunner',
                'description': 'Combinaison spécialisée pour les netrunners avec isolation EM et ports de connexion multiples.',
                'price': 1200.00,
                'category': 'vetements-tech',
                'stock': 12,
                'featured': False
            },
            {
                'name': 'Bottes de Combat Militech',
                'description': 'Bottes tactiques avec amortisseurs hydrauliques et semelles magnétiques.',
                'price': 450.00,
                'category': 'vetements-tech',
                'stock': 30,
                'featured': False
            },
            
            # Gadgets
            {
                'name': 'Deck de Hacking Zetatech',
                'description': 'Ordinateur portable de hacking avec processeurs quantiques et IA assistante.',
                'price': 5500.00,
                'category': 'gadgets',
                'stock': 3,
                'featured': True
            },
            {
                'name': 'Communicateur Holo',
                'description': 'Dispositif de communication holographique avec chiffrement militaire.',
                'price': 680.00,
                'category': 'gadgets',
                'stock': 20,
                'featured': False
            },
            {
                'name': 'Scanner Médical Portable',
                'description': 'Scanner médical de poche pour diagnostic instantané et premiers soins.',
                'price': 1100.00,
                'category': 'gadgets',
                'stock': 18,
                'featured': False
            },
            
            # Armes
            {
                'name': 'Pistolet Plasma Nova',
                'description': 'Arme à plasma de dernière génération avec cellules énergétiques haute capacité.',
                'price': 3800.00,
                'category': 'armes',
                'stock': 7,
                'featured': True
            },
            {
                'name': 'Fusil de Précision Militech',
                'description': 'Fusil de précision avec guidage électronique et munitions perforantes.',
                'price': 6200.00,
                'category': 'armes',
                'stock': 4,
                'featured': False
            },
            {
                'name': 'Katana Mono-Wire',
                'description': 'Katana traditionnel avec lame en fil mono-moléculaire. Tranche tout.',
                'price': 2800.00,
                'category': 'armes',
                'stock': 10,
                'featured': True
            }
        ]
        
        for prod_data in products_data:
            category_slug = prod_data.pop('category')
            prod_data['category'] = categories[category_slug]
            
            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                defaults=prod_data
            )
            if created:
                self.stdout.write(f'✅ Produit créé: {product.name}')
        
        self.stdout.write('🎉 Données de test créées avec succès!')
        self.stdout.write(f'📊 {Category.objects.count()} catégories')
        self.stdout.write(f'📦 {Product.objects.count()} produits')