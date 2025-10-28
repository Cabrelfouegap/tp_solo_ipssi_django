from django.core.management.base import BaseCommand
from products.models import Product
import os
import shutil
from django.conf import settings
from django.core.files import File


class Command(BaseCommand):
    help = 'Importe les images locales vers les produits'

    def handle(self, *args, **options):
        self.stdout.write('📷 Importation des images locales...')
        
        # Mapping des noms de fichiers vers les noms de produits
        image_mapping = {
            'iphone15pro.jpg': 'iPhone 15 Pro Max',
            'GooglePixel8Pro.jpg': 'Google Pixel 8 Pro',
            'ASUSROGZephyrusG16.jpg': 'ASUS ROG Zephyrus G16',
            'RazerDeathAdderV3Pro.jpg': 'Razer DeathAdder V3 Pro',
            'CorsairK95RGBPlatinumXT.jpeg': 'Corsair K95 RGB Platinum XT',
            'SonyWH-1000XM5.jpg': 'Sony WH-1000XM5',
            'AirPodsPro2èmegénération.png': 'AirPods Pro 2ème génération',
            'BoseQuietComfort45.jpg': 'Bose QuietComfort 45',
            'SennheiserMomentum4.jpg': 'Sennheiser Momentum 4',
            'AppleWatchSeries9.jpg': 'Apple Watch Series 9'
        }
        
        # Chemin source des images
        source_dir = r'D:\IPSSI\COURS\API PYTHON DJANGO RESTFULL & IA\django_learn'
        
        # Chemin de destination dans Django
        media_root = settings.MEDIA_ROOT
        products_media_dir = os.path.join(media_root, 'products')
        
        # Créer le dossier products s'il n'existe pas
        os.makedirs(products_media_dir, exist_ok=True)
        
        success_count = 0
        
        for image_filename, product_name in image_mapping.items():
            try:
                # Chemin complet de l'image source
                source_path = os.path.join(source_dir, image_filename)
                
                # Vérifier si le fichier source existe
                if not os.path.exists(source_path):
                    self.stdout.write(f'⚠️ Image non trouvée: {source_path}')
                    continue
                
                # Chercher le produit correspondant
                try:
                    product = Product.objects.get(name=product_name)
                except Product.DoesNotExist:
                    self.stdout.write(f'⚠️ Produit non trouvé: {product_name}')
                    continue
                
                # Nom de fichier de destination (nettoyé)
                clean_filename = f"{product.id}_{image_filename}"
                dest_path = os.path.join(products_media_dir, clean_filename)
                
                # Copier l'image
                shutil.copy2(source_path, dest_path)
                
                # Mettre à jour le produit avec le chemin relatif
                relative_path = f"products/{clean_filename}"
                product.image.name = relative_path
                product.save()
                
                self.stdout.write(f'✅ Image ajoutée pour {product.name}')
                success_count += 1
                
            except Exception as e:
                self.stdout.write(f'❌ Erreur pour {image_filename}: {str(e)}')
        
        self.stdout.write(f'🎉 Import terminé! {success_count} images importées.')
        
        # Afficher le statut final
        products_with_images = Product.objects.exclude(image='').count()
        total_products = Product.objects.count()
        self.stdout.write(f'📊 {products_with_images}/{total_products} produits ont des images')