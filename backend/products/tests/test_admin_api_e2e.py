import io
from PIL import Image as PilImage
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from products.models import Product


def generate_test_image(filename='test.png', size=(50, 50), color='blue') -> SimpleUploadedFile:
    """Helper to generate a valid in-memory PNG image file for tests."""
    image_buffer = io.BytesIO()
    image = PilImage.new('RGB', size, color=color)
    image.save(image_buffer, format='PNG')
    image_buffer.seek(0)
    return SimpleUploadedFile(
        filename,
        image_buffer.getvalue(),
        content_type='image/png',
    )


class AdminProductApiE2ETests(TestCase):
    """
    Comprehensive End-to-End API Integration tests for the Sealox Admin REST API.
    Validates pure JSON serialization, decoupled image uploads, slug validation,
    template duplication, visibility toggling, and error edge cases.
    """

    def setUp(self):
        self.client = APIClient()
        self.sample_product = Product.objects.create(
            name='SL-CARTRIDGE SINGLE SEAL',
            slug='sl-cartridge-single-seal',
            category='Cartridge Seals',
            subtitle='Heavy-duty refinery pump seal',
            description='Industrial cartridge seal designed for API 682 compliance.',
            static_image_path='/products/cartridge.png',
            operating_limits=[
                {'label': 'Shaft Diameter', 'value': '25mm - 100mm'},
                {'label': 'Pressure', 'value': '25 bar'},
            ],
            face_materials=[
                {'label': 'Rotary Face', 'value': 'Silicon Carbide (SiC)'},
                {'label': 'Stationary Seat', 'value': 'Carbon'},
            ],
            secondary_seal_materials=['Viton', 'Kalrez'],
            metal_parts=['SS 316', 'Hastelloy C-276'],
            seal_components=[
                {'code': 1, 'name': 'Sleeve'},
                {'code': 2, 'name': 'Gland Plate'},
            ],
            applications=['Oil Refinery', 'Chemical Processing'],
            is_active=True,
            order=1,
        )

    # --------------------------------------------------------------------------
    # 1. Media Upload Endpoint Tests
    # --------------------------------------------------------------------------

    def test_upload_valid_image_returns_201_and_path(self):
        """Valid PNG image uploaded returns 201 with saved URL and file path."""
        url = reverse('products:admin-image-upload')
        test_file = generate_test_image(filename='cartridge_seal.png')

        response = self.client.post(url, {'file': test_file}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('url', response.data)
        self.assertIn('file_path', response.data)
        self.assertTrue('cartridge_seal' in response.data['file_path'])

    def test_upload_missing_file_returns_400(self):
        """Upload request with no file attached returns 400 Bad Request."""
        url = reverse('products:admin-image-upload')

        response = self.client.post(url, {}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'No image file was provided.')

    def test_upload_corrupt_file_returns_400(self):
        """Upload request with corrupt/non-image binary payload returns 400 Bad Request."""
        url = reverse('products:admin-image-upload')
        corrupt_file = SimpleUploadedFile(
            'bad_image.png',
            b'not a valid png binary data header',
            content_type='image/png',
        )

        response = self.client.post(url, {'file': corrupt_file}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'The uploaded file is not a valid image.')

    def test_upload_file_exceeding_10mb_returns_400(self):
        """Upload request exceeding 10MB limit returns 400 Bad Request."""
        url = reverse('products:admin-image-upload')
        # Create bytes buffer larger than 10MB
        oversized_bytes = b'X' * (10 * 1024 * 1024 + 1024)
        oversized_file = SimpleUploadedFile(
            'huge_drawing.png',
            oversized_bytes,
            content_type='image/png',
        )

        response = self.client.post(url, {'file': oversized_file}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'File size exceeds the 10MB limit.')

    # --------------------------------------------------------------------------
    # 2. Product Catalog List & Filter Tests
    # --------------------------------------------------------------------------

    def test_list_admin_catalog_returns_all_including_inactive(self):
        """Admin list returns all active and inactive products."""
        # Create an inactive draft product
        Product.objects.create(
            name='SL-DRAFT MODEL',
            slug='sl-draft-model',
            category='Bellows Seals',
            is_active=False,
        )

        url = reverse('products:admin-product-list-create')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [p['slug'] for p in response.data]
        self.assertIn('sl-cartridge-single-seal', slugs)
        self.assertIn('sl-draft-model', slugs)
        self.assertGreaterEqual(len(response.data), 2)

    def test_list_admin_catalog_category_filter(self):
        """Querying with category filter narrows results accurately."""
        url = reverse('products:admin-product-list-create')
        response = self.client.get(url, {'category': 'Cartridge'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for item in response.data:
            self.assertIn('Cartridge', item['category'])

    # --------------------------------------------------------------------------
    # 3. Product Pure-JSON Creation Tests
    # --------------------------------------------------------------------------

    def test_create_product_pure_json_payload_success(self):
        """Creates a mechanical seal product record using pure application/json with nested arrays."""
        url = reverse('products:admin-product-list-create')
        payload = {
            'name': 'SL-MULTI-SPRING HIGH PRESSURE SEAL',
            'slug': 'sl-multi-spring-high-pressure-seal',
            'category': 'Multi Spring Seals',
            'subtitle': 'Balanced multi-spring seal for slurry pumps',
            'description': 'Designed for high operating pressure with balanced face design.',
            'static_image_path': '/products/multi-spring.png',
            'operating_limits': [
                {'label': 'Temperature', 'value': '-20°C to 220°C'},
                {'label': 'Pressure', 'value': '35 bar'},
            ],
            'face_materials': [
                {'label': 'Rotary Face', 'value': 'Tungsten Carbide (TC)'},
                {'label': 'Stationary Seat', 'value': 'Silicon Carbide (SiC)'},
            ],
            'secondary_seal_materials': ['FKM', 'Aflas'],
            'metal_parts': ['SS 316L', 'Inconel 718'],
            'seal_components': [
                {'code': 1, 'name': 'Rotary Face Ring'},
                {'code': 2, 'name': 'Multiple Springs'},
                {'code': 3, 'name': 'Thrust Collar'},
            ],
            'applications': ['Slurry Pumping', 'Pulp & Paper'],
            'is_active': True,
            'order': 5,
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['slug'], 'sl-multi-spring-high-pressure-seal')
        self.assertEqual(len(response.data['operating_limits']), 2)
        self.assertEqual(len(response.data['face_materials']), 2)
        self.assertEqual(len(response.data['seal_components']), 3)
        self.assertIn('FKM', response.data['secondary_seal_materials'])

        # Verify database record
        created = Product.objects.get(slug='sl-multi-spring-high-pressure-seal')
        self.assertEqual(created.name, 'SL-MULTI-SPRING HIGH PRESSURE SEAL')
        self.assertEqual(created.order, 5)

    def test_create_product_blank_name_fails_validation(self):
        """Creating product with empty name returns 400 Bad Request."""
        url = reverse('products:admin-product-list-create')
        payload = {
            'name': '   ',
            'slug': 'sl-invalid-empty-name',
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_product_duplicate_slug_fails_validation(self):
        """Creating product with already taken slug returns 400 Bad Request."""
        url = reverse('products:admin-product-list-create')
        payload = {
            'name': 'Duplicate Slug Model',
            'slug': 'sl-cartridge-single-seal',  # Already exists in setUp
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('slug', response.data)

    def test_create_product_invalid_slug_characters_fails_validation(self):
        """Creating product with invalid slug characters returns 400 Bad Request."""
        url = reverse('products:admin-product-list-create')
        payload = {
            'name': 'Bad Slug Model',
            'slug': 'SL_INVALID SLUG!',
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('slug', response.data)

    # --------------------------------------------------------------------------
    # 4. Product Detail, Update & Delete Tests
    # --------------------------------------------------------------------------

    def test_retrieve_product_by_id_or_slug(self):
        """Product can be retrieved by either integer ID or slug string."""
        url_by_slug = reverse('products:admin-product-detail', kwargs={'lookup': self.sample_product.slug})
        url_by_id = reverse('products:admin-product-detail', kwargs={'lookup': str(self.sample_product.id)})

        resp_slug = self.client.get(url_by_slug)
        resp_id = self.client.get(url_by_id)

        self.assertEqual(resp_slug.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_id.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_slug.data['id'], resp_id.data['id'])

    def test_partial_update_product_specifications(self):
        """PATCH endpoint updates specific JSON arrays while retaining existing data."""
        url = reverse('products:admin-product-detail', kwargs={'lookup': self.sample_product.slug})
        patch_payload = {
            'subtitle': 'Updated High Performance Seal Subtitle',
            'operating_limits': [
                {'label': 'Shaft Diameter', 'value': '30mm - 120mm'},
                {'label': 'Pressure', 'value': '40 bar'},
                {'label': 'Speed', 'value': '3600 RPM'},
            ],
        }

        response = self.client.patch(url, patch_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['subtitle'], 'Updated High Performance Seal Subtitle')
        self.assertEqual(len(response.data['operating_limits']), 3)

        # Refresh from database and assert
        self.sample_product.refresh_from_db()
        self.assertEqual(self.sample_product.subtitle, 'Updated High Performance Seal Subtitle')
        self.assertEqual(len(self.sample_product.operating_limits), 3)

    def test_delete_product_removes_from_database(self):
        """DELETE endpoint removes product record completely."""
        product_id = self.sample_product.id
        url = reverse('products:admin-product-detail', kwargs={'lookup': str(product_id)})

        delete_response = self.client.delete(url)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        # Confirm non-existence
        self.assertFalse(Product.objects.filter(pk=product_id).exists())

    # --------------------------------------------------------------------------
    # 5. Visibility Toggle & Template Duplicate Tests
    # --------------------------------------------------------------------------

    def test_toggle_product_visibility(self):
        """Toggles product is_active boolean from True to False and back."""
        url = reverse('products:admin-product-toggle-active', kwargs={'lookup': self.sample_product.slug})

        # First toggle: True -> False
        resp1 = self.client.post(url)
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        self.assertFalse(resp1.data['is_active'])

        self.sample_product.refresh_from_db()
        self.assertFalse(self.sample_product.is_active)

        # Second toggle: False -> True
        resp2 = self.client.post(url)
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertTrue(resp2.data['is_active'])

        self.sample_product.refresh_from_db()
        self.assertTrue(self.sample_product.is_active)

    def test_duplicate_product_as_template(self):
        """Duplicates existing product with (Copy) name suffix and sets draft is_active=False."""
        url = reverse('products:admin-product-duplicate', kwargs={'lookup': self.sample_product.slug})

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('(Copy)', response.data['name'])
        self.assertFalse(response.data['is_active'])
        self.assertNotEqual(response.data['slug'], self.sample_product.slug)

        # Verify duplicated specifications match original
        self.assertEqual(len(response.data['operating_limits']), len(self.sample_product.operating_limits))
        self.assertEqual(len(response.data['face_materials']), len(self.sample_product.face_materials))
        self.assertEqual(response.data['secondary_seal_materials'], self.sample_product.secondary_seal_materials)
