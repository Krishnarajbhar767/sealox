from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Product, ProductGalleryImage


class Command(BaseCommand):
    help = 'Seeds initial catalog products and creates default admin user'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Beginning Sealox database seeding...'))

        # 1. Ensure Superuser exists for Django Admin
        if not User.objects.filter(is_superuser=True).exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='salessealox@gmail.com',
                password='password123'
            )
            self.stdout.write(
                self.style.SUCCESS(
                    "Created default superuser: username='admin', password='password123' (Change in /admin/ afterwards)"
                )
            )
        else:
            self.stdout.write(self.style.SUCCESS('Superuser already exists.'))

        # 2. Seed Product 1: Close / Stock Type Elastomer Unbalanced Seal
        p1, created1 = Product.objects.update_or_create(
            slug='close-stock-type-elastomer-unbalanced-seal',
            defaults={
                'name': 'CLOSE / STOCK TYPE ELASTOMER UNBALANCED SEAL',
                'category': 'Mechanical Seals • Elastomer Bellows',
                'subtitle': 'Close Stock Type Elastomer Unbalanced Shaft Seal',
                'static_image_path': '/products/close-seal-photo.png',
                'description': (
                    'Engineered for reliable rotary fluid containment in centrifugal pumps, '
                    'agitators, and mixers. Designed with a robust elastomeric bellows drive mechanism, '
                    'single helical spring, and high-integrity sealing faces for chemical, refinery, '
                    'and industrial water systems.'
                ),
                'operating_limits': [
                    {'label': 'Seal Size', 'value': '12mm to 50mm'},
                    {'label': 'Pressure', 'value': '8 kg/cm²'},
                    {'label': 'Speed', 'value': '10 m/s'},
                    {'label': 'Temp', 'value': '-10°C to 120°C'},
                ],
                'face_materials': [
                    {'label': 'Rotary Face', 'value': 'Carbon, Silicon, TC'},
                    {'label': 'Stationary Seats', 'value': 'Silicon, TC, SS, Ceramic'},
                    {'label': 'Type', 'value': 'S-60, S-50'},
                ],
                'secondary_seal_materials': ['Viton', 'NBR', 'EPDM', 'Silicon'],
                'metal_parts': ['SS304', 'SS316'],
                'seal_components': [
                    {'code': 1, 'name': 'Elastomer Bellow'},
                    {'code': 2, 'name': 'SS Casing'},
                    {'code': 3, 'name': 'SS Spring'},
                    {'code': 4, 'name': 'Seal Face'},
                    {'code': 5, 'name': 'Stationary Seat'},
                    {'code': 6, 'name': 'Stationary Packing'},
                    {'code': 8, 'name': 'SS Corner Ring'},
                ],
                'applications': ['Chemical Plant', 'Oil Refinery', 'Water'],
                'is_active': True,
                'order': 1,
            }
        )

        # Clear existing gallery images and recreate
        p1.gallery_images.all().delete()
        ProductGalleryImage.objects.create(
            product=p1,
            static_image_path='/products/close-seal-photo.png',
            caption='Product Real Photograph',
            order=1
        )
        ProductGalleryImage.objects.create(
            product=p1,
            static_image_path='/products/close-seal-diagram.png',
            caption='Cross-section Technical Schematic',
            order=2
        )
        self.stdout.write(self.style.SUCCESS(f'Product 1 configured: {p1.name} (Created: {created1})'))

        # 3. Seed Product 2: Open Type Elastomer Unbalanced Seal
        p2, created2 = Product.objects.update_or_create(
            slug='open-type-elastomer-unbalanced-seal',
            defaults={
                'name': 'OPEN TYPE ELASTOMER UNBALANCED SEAL',
                'category': 'Mechanical Seals • Elastomer Bellows',
                'subtitle': 'Open Wave Spring Elastomer Unbalanced Shaft Seal',
                'static_image_path': '/products/open-seal-photo.png',
                'description': (
                    'Engineered with an open profile spring arrangement for viscous, slurry-prone, '
                    'or general industrial media. Features self-aligning elastomeric bellow compensation, '
                    'multi-material face compatibility, and elastomer gasket protection.'
                ),
                'operating_limits': [
                    {'label': 'Seal Size', 'value': '12 mm to 50mm'},
                    {'label': 'Pressure', 'value': '8 kg/cm²'},
                    {'label': 'Speed', 'value': '10 m/s'},
                    {'label': 'Temp', 'value': '-10°C to 120°C'},
                ],
                'face_materials': [
                    {'label': 'Rotary Face', 'value': 'Ceramic, Silicon, TC'},
                    {'label': 'Stationary Seats', 'value': 'Silicon, TC, SS, Ceramic'},
                    {'label': 'Type', 'value': 'S-60, S-50, S-55, S-6'},
                ],
                'secondary_seal_materials': ['Viton', 'NBR', 'EPDM', 'Silicon'],
                'metal_parts': ['SS304', 'SS316'],
                'seal_components': [
                    {'code': 1, 'name': 'Elastomer Bellow'},
                    {'code': 2, 'name': 'SS Casing'},
                    {'code': 3, 'name': 'SS Spring'},
                    {'code': 4, 'name': 'Seal Face'},
                    {'code': 5, 'name': 'Stationary Seat'},
                    {'code': 6, 'name': 'Stationary Packing'},
                    {'code': 8, 'name': 'SS Corner Ring'},
                    {'code': 21, 'name': 'Elastomer Gasket'},
                ],
                'applications': ['Chemical Plant', 'Oil Refinery', 'Water'],
                'is_active': True,
                'order': 2,
            }
        )

        p2.gallery_images.all().delete()
        ProductGalleryImage.objects.create(
            product=p2,
            static_image_path='/products/open-seal-photo.png',
            caption='Product Real Photograph',
            order=1
        )
        ProductGalleryImage.objects.create(
            product=p2,
            static_image_path='/products/open-seal-diagram.png',
            caption='Cross-section Technical Schematic',
            order=2
        )
        self.stdout.write(self.style.SUCCESS(f'Product 2 configured: {p2.name} (Created: {created2})'))

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with catalog seals!'))
