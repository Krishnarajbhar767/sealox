from django.urls import path
from .views import (
    ProductListAPIView,
    ProductDetailAPIView,
    AdminLoginAPIView,
    AdminVerifyAPIView,
    AdminProductListCreateAPIView,
    AdminProductDetailAPIView,
    AdminProductDuplicateAPIView,
    AdminProductToggleActiveAPIView,
    AdminProductImageUploadAPIView,
)

app_name = 'products'

urlpatterns = [
    # Admin Authentication APIs
    path('admin/auth/login/', AdminLoginAPIView.as_view(), name='admin-auth-login'),
    path('admin/auth/verify/', AdminVerifyAPIView.as_view(), name='admin-auth-verify'),

    # React Admin Panel REST APIs (Protected)
    path('admin/', AdminProductListCreateAPIView.as_view(), name='admin-product-list-create'),
    path('admin/upload-image/', AdminProductImageUploadAPIView.as_view(), name='admin-image-upload'),
    path('admin/<str:lookup>/', AdminProductDetailAPIView.as_view(), name='admin-product-detail'),
    path('admin/<str:lookup>/duplicate/', AdminProductDuplicateAPIView.as_view(), name='admin-product-duplicate'),
    path('admin/<str:lookup>/toggle-active/', AdminProductToggleActiveAPIView.as_view(), name='admin-product-toggle-active'),

    # Public Storefront API
    path('', ProductListAPIView.as_view(), name='product-list'),
    path('<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail'),
]
