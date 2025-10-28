from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Ajoute de vrais produits tech avec des données réalistes'

    def handle(self, *args, **options):
        self.stdout.write('🛍️ Création de vrais produits...')
        
        # Création des catégories réalistes
        categories_data = [
            {
                'name': 'Smartphones',
                'description': 'Derniers smartphones et téléphones mobiles',
                'slug': 'smartphones'
            },
            {
                'name': 'Ordinateurs Portables',
                'description': 'Laptops, ultrabooks et ordinateurs portables',
                'slug': 'ordinateurs-portables'
            },
            {
                'name': 'Accessoires Gaming',
                'description': 'Claviers, souris, casques et accessoires gaming',
                'slug': 'accessoires-gaming'
            },
            {
                'name': 'Audio & Casques',
                'description': 'Casques, écouteurs et systèmes audio',
                'slug': 'audio-casques'
            },
            {
                'name': 'Montres Connectées',
                'description': 'Smartwatches et montres connectées',
                'slug': 'montres-connectees'
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
        
        # Création des vrais produits
        products_data = [
            # Smartphones
            {
                'name': 'iPhone 15 Pro Max',
                'description': 'Le dernier iPhone avec puce A17 Pro, caméra 48MP et écran Super Retina XDR de 6,7 pouces. Design en titane premium.',
                'price': 1479.00,
                'category': 'smartphones',
                'stock': 25,
                'featured': True
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'description': 'Smartphone Android flagship avec S Pen intégré, caméra 200MP et écran Dynamic AMOLED 2X de 6,8 pouces.',
                'price': 1399.00,
                'category': 'smartphones',
                'stock': 18,
                'featured': True
            },
            {
                'name': 'Google Pixel 8 Pro',
                'description': 'Smartphone Google avec IA avancée, caméra computationnelle exceptionnelle et Android pur.',
                'price': 899.00,
                'category': 'smartphones',
                'stock': 22,
                'featured': False
            },
            {
                'name': 'OnePlus 12',
                'description': 'Smartphone premium avec charge rapide 100W, écran 120Hz et design élégant.',
                'price': 799.00,
                'category': 'smartphones',
                'stock': 15,
                'featured': False
            },
            
            # Ordinateurs Portables
            {
                'name': 'MacBook Pro 16" M3 Max',
                'description': 'Ordinateur portable professionnel avec puce M3 Max, 36GB RAM, écran Liquid Retina XDR.',
                'price': 3999.00,
                'category': 'ordinateurs-portables',
                'stock': 8,
                'featured': True
            },
            {
                'name': 'Dell XPS 15',
                'description': 'Ultrabook premium avec écran OLED 4K, processeur Intel i9 et carte graphique RTX 4070.',
                'price': 2499.00,
                'category': 'ordinateurs-portables',
                'stock': 12,
                'featured': True
            },
            {
                'name': 'ASUS ROG Zephyrus G16',
                'description': 'Laptop gaming fin et puissant avec RTX 4080, écran 240Hz et design premium.',
                'price': 2299.00,
                'category': 'ordinateurs-portables',
                'stock': 10,
                'featured': False
            },
            {
                'name': 'ThinkPad X1 Carbon Gen 11',
                'description': 'Ultrabook professionnel léger avec sécurité enterprise et autonomie exceptionnelle.',
                'price': 1899.00,
                'category': 'ordinateurs-portables',
                'stock': 20,
                'featured': False
            },
            
            # Accessoires Gaming
            {
                'name': 'Razer DeathAdder V3 Pro',
                'description': 'Souris gaming sans fil avec capteur Focus Pro 30K, switches optiques et ergonomie parfaite.',
                'price': 149.99,
                'category': 'accessoires-gaming',
                'stock': 45,
                'featured': True
            },
            {
                'name': 'Corsair K95 RGB Platinum XT',
                'description': 'Clavier mécanique gaming avec switches Cherry MX, éclairage RGB et touches macro.',
                'price': 199.99,
                'category': 'accessoires-gaming',
                'stock': 30,
                'featured': False
            },
            {
                'name': 'SteelSeries Arctis Nova Pro',
                'description': 'Casque gaming premium avec audio haute résolution et microphone ClearCast Gen 2.',
                'price': 349.99,
                'category': 'accessoires-gaming',
                'stock': 25,
                'featured': True
            },
            {
                'name': 'Logitech G Pro X Superlight 2',
                'description': 'Souris gaming ultra-légère (60g) avec capteur HERO 25K et autonomie 95h.',
                'price': 159.99,
                'category': 'accessoires-gaming',
                'stock': 35,
                'featured': False
            },
            
            # Audio & Casques
            {
                'name': 'Sony WH-1000XM5',
                'description': 'Casque sans fil premium avec réduction de bruit leader et autonomie 30h.',
                'price': 399.99,
                'category': 'audio-casques',
                'stock': 40,
                'featured': True
            },
            {
                'name': 'AirPods Pro 2ème génération',
                'description': 'Écouteurs sans fil Apple avec réduction de bruit adaptative et son spatial.',
                'price': 279.00,
                'category': 'audio-casques',
                'stock': 50,
                'featured': True
            },
            {
                'name': 'Bose QuietComfort 45',
                'description': 'Casque avec réduction de bruit légendaire Bose et confort exceptionnel.',
                'price': 329.99,
                'category': 'audio-casques',
                'stock': 28,
                'featured': False
            },
            {
                'name': 'Sennheiser Momentum 4',
                'description': 'Casque audiophile avec autonomie 60h et qualité sonore exceptionnelle.',
                'price': 349.99,
                'category': 'audio-casques',
                'stock': 22,
                'featured': False
            },
            
            # Montres Connectées
            {
                'name': 'Apple Watch Series 9',
                'description': 'Montre connectée avec puce S9, écran Always-On et fonctionnalités santé avancées.',
                'price': 429.00,
                'category': 'montres-connectees',
                'stock': 35,
                'featured': True
            },
            {
                'name': 'Samsung Galaxy Watch 6 Classic',
                'description': 'Smartwatch avec lunette rotative, monitoring santé 24/7 et design premium.',
                'price': 399.99,
                'category': 'montres-connectees',
                'stock': 25,
                'featured': False
            },
            {
                'name': 'Garmin Fenix 7X',
                'description': 'Montre multisport avec GPS précis, autonomie 28 jours et résistance militaire.',
                'price': 799.99,
                'category': 'montres-connectees',
                'stock': 15,
                'featured': False
            },
            {
                'name': 'Fitbit Sense 2',
                'description': 'Montre santé avec capteurs avancés, gestion du stress et suivi du sommeil.',
                'price': 299.99,
                'category': 'montres-connectees',
                'stock': 30,
                'featured': False
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
        
        self.stdout.write('🎉 Vrais produits créés avec succès!')
        self.stdout.write(f'📊 {Category.objects.count()} catégories')
        self.stdout.write(f'📦 {Product.objects.count()} produits')
        self.stdout.write(f'⭐ {Product.objects.filter(featured=True).count()} produits mis en avant')