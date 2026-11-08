from rest_framework import generics, filters, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate
from PIL import Image
from sealox.authentication import generate_admin_token
from .models import Product
from .serializers import ProductSerializer, AdminProductSerializer


def _resolve_product_by_lookup(base_queryset, lookup_identifier: str) -> Product:
    """
    Safely resolves a product by either primary key integer or slug string.
    Prioritizes primary key lookups if numeric, then falls back to slug,
    preventing MultipleObjectsReturned exceptions if a slug happens to match an ID.
    """
    if lookup_identifier.isdigit():
        product_record = base_queryset.filter(id=int(lookup_identifier)).first()
        if product_record:
            return product_record

    return get_object_or_404(base_queryset, slug=lookup_identifier)


# ==========================================
# PUBLIC STOREFRONT API VIEWS
# ==========================================

class ProductListAPIView(generics.ListAPIView):
    """
    Public storefront list: returns only active catalog products.
    Supports filtering by ?category=... and searching by ?search=...
    """
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'slug', 'category', 'subtitle', 'description']

    def get_queryset(self):
        active_products_queryset = (
            Product.objects.filter(is_active=True)
            .prefetch_related('gallery_images')
            .order_by('order', 'id')
        )
        category_query_filter = self.request.query_params.get('category')
        if category_query_filter:
            active_products_queryset = active_products_queryset.filter(
                category__icontains=category_query_filter
            )
        return active_products_queryset


class ProductDetailAPIView(generics.RetrieveAPIView):
    """
    Public storefront detail: returns active product by slug or id.
    """
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_object(self):
        lookup_identifier = self.kwargs.get('slug')
        requesting_user = self.request.user
        is_authorized_staff = bool(
            requesting_user
            and requesting_user.is_authenticated
            and requesting_user.is_staff
        )
        base_queryset = Product.objects.prefetch_related('gallery_images')
        if not is_authorized_staff:
            base_queryset = base_queryset.filter(is_active=True)

        return _resolve_product_by_lookup(base_queryset, lookup_identifier)


# ==========================================
# ADMIN REACT PANEL API VIEWS
# ==========================================

class AdminLoginAPIView(APIView):
    """
    Public Authentication endpoint for React Admin Panel.
    Validates admin username and password, returns signed admin bearer token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if not user or not user.is_active:
            return Response(
                {'error': 'Invalid username or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not (user.is_staff or user.is_superuser):
            return Response(
                {'error': 'Access denied: Administrator privileges required.'},
                status=status.HTTP_403_FORBIDDEN
            )

        token = generate_admin_token(user)
        return Response({
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        }, status=status.HTTP_200_OK)


class AdminVerifyAPIView(APIView):
    """
    Token verification endpoint for React Admin.
    Checks whether the provided Bearer token or session is valid.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff,
                'is_superuser': request.user.is_superuser,
            }
        }, status=status.HTTP_200_OK)


class AdminProductListCreateAPIView(generics.ListCreateAPIView):
    """
    Admin API: List all products (both active & drafts) or create a new product.
    Requires administrator authentication.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'slug', 'category', 'subtitle', 'description']

    def get_queryset(self):
        all_products_queryset = (
            Product.objects.all()
            .prefetch_related('gallery_images')
            .order_by('order', 'id')
        )
        category_query_filter = self.request.query_params.get('category')
        if category_query_filter:
            all_products_queryset = all_products_queryset.filter(
                category__icontains=category_query_filter
            )
        return all_products_queryset


class AdminProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin API: Retrieve, update, or delete a product by id or slug.
    Requires administrator authentication.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminProductSerializer

    def get_object(self):
        lookup_identifier = self.kwargs.get('lookup')
        base_queryset = Product.objects.prefetch_related('gallery_images')
        return _resolve_product_by_lookup(base_queryset, lookup_identifier)


class AdminProductDuplicateAPIView(APIView):
    """
    Admin API: Thin controller delegating product template duplication to the Model.
    Requires administrator authentication.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request, lookup):
        source_product = _resolve_product_by_lookup(Product.objects.all(), lookup)
        duplicated_product = source_product.duplicate_as_template()

        serialized_product = AdminProductSerializer(duplicated_product)
        return Response(serialized_product.data, status=status.HTTP_201_CREATED)


class AdminProductToggleActiveAPIView(APIView):
    """
    Admin API: Fast toggle for storefront visibility status.
    Requires administrator authentication.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request, lookup):
        target_product = _resolve_product_by_lookup(Product.objects.all(), lookup)
        target_product.is_active = not target_product.is_active
        target_product.save(update_fields=['is_active'])

        return Response({
            'id': target_product.id,
            'slug': target_product.slug,
            'is_active': target_product.is_active,
            'message': (
                f"Product '{target_product.name}' is now "
                f"{'Active on Storefront' if target_product.is_active else 'Draft / Hidden'}."
            )
        })


class AdminProductImageUploadAPIView(APIView):
    """
    Dedicated media upload API: handles binary file validation, size limits,
    Pillow image integrity verification, and storage.
    Requires administrator authentication.
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get('image') or request.FILES.get('file')
        if not uploaded_file:
            return Response({'error': 'No image file was provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # Enforce 10MB size limit
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response({'error': 'File size exceeds the 10MB limit.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify image integrity with Pillow
        try:
            image_checker = Image.open(uploaded_file)
            image_checker.verify()
            uploaded_file.seek(0)
        except Exception:
            return Response({'error': 'The uploaded file is not a valid image.'}, status=status.HTTP_400_BAD_REQUEST)

        clean_filename = uploaded_file.name.replace(' ', '_')
        saved_relative_path = default_storage.save(f'products/{clean_filename}', uploaded_file)
        saved_file_url = default_storage.url(saved_relative_path)

        return Response({
            'url': saved_file_url,
            'file_path': saved_relative_path,
            'filename': clean_filename,
        }, status=status.HTTP_201_CREATED)


