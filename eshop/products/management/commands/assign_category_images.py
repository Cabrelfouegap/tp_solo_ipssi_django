from django.core.management.base import BaseCommand
from products.models import Product
import random


class Command(BaseCommand):
    help = 'Attribue des images existantes aux produits sans image selon leur catégorie'

    def handle(self, *args, **options):
        self.stdout.write('🖼️ Attribution d\'images aux produits sans image...')
        
        # Mapping des catégories avec les images disponibles
        category_image_mapping = {
            'smartphones': [
                'products/13_iphone15pro.jpg',  # iPhone 15 Pro Max
                'products/15_GooglePixel8Pro.jpg',  # Google Pixel 8 Pro
            ],
            'ordinateurs-portables': [
                'products/19_ASUSROGZephyrusG16.jpg',  # ASUS ROG Zephyrus G16
            ],
            'accessoires-gaming': [
                'products/21_RazerDeathAdderV3Pro.jpg',  # Razer DeathAdder V3 Pro
                'products/22_CorsairK95RGBPlatinumXT.jpeg',  # Corsair K95 RGB Platinum XT
            ],
            'audio-casques': [
                'products/25_SonyWH-1000XM5.jpg',  # Sony WH-1000XM5
                'products/26_AirPodsPro2èmegénération.png',  # AirPods Pro 2ème génération
                'products/27_BoseQuietComfort45.jpg',  # Bose QuietComfort 45
                'products/28_SennheiserMomentum4.jpg',  # Sennheiser Momentum 4
            ],
            'montres-connectees': [
                'products/29_AppleWatchSeries9.jpg',  # Apple Watch Series 9
            ]
        }
        
        # Récupérer tous les produits sans image
        products_without_image = Product.objects.filter(image__in=['', None])
        
        success_count = 0
        
        for product in products_without_image:
            category_slug = product.category.slug
            
            # Vérifier si nous avons des images pour cette catégorie
            if category_slug in category_image_mapping:
                available_images = category_image_mapping[category_slug]
                
                # Choisir une image aléatoirement parmi celles disponibles
                chosen_image = random.choice(available_images)
                
                # Attribuer l'image au produit
                product.image = chosen_image
                product.save()
                
                self.stdout.write(f'✅ Image attribuée à {product.name}: {chosen_image}')
                success_count += 1
            else:
                # Si pas d'image pour cette catégorie, utiliser une image générique
                # On peut prendre une image d'une catégorie similaire
                fallback_images = []
                for images in category_image_mapping.values():
                    fallback_images.extend(images)
                
                if fallback_images:
                    chosen_image = random.choice(fallback_images)
                    product.image = chosen_image
                    product.save()
                    
                    self.stdout.write(f'🔄 Image fallback attribuée à {product.name}: {chosen_image}')
                    success_count += 1
                else:
                    self.stdout.write(f'⚠️ Aucune image disponible pour {product.name}')
        
        # Afficher le statut final
        products_with_images = Product.objects.exclude(image__in=['', None]).count()
        total_products = Product.objects.count()
        
        self.stdout.write(f'🎉 Attribution terminée! {success_count} images attribuées.')
        self.stdout.write(f'📊 {products_with_images}/{total_products} produits ont maintenant des images')
        
        # Afficher la répartition par catégorie
        self.stdout.write('\n📈 Répartition par catégorie:')
        categories = Product.objects.values_list('category__name', flat=True).distinct()
        for category_name in categories:
            category_products = Product.objects.filter(category__name=category_name)
            products_with_img = category_products.exclude(image__in=['', None]).count()
            total_in_category = category_products.count()
            self.stdout.write(f'   {category_name}: {products_with_img}/{total_in_category} avec images')