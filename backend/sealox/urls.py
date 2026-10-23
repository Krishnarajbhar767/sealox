"""
URL configuration for sealox project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.static import serve

def health_check(request):
    """Zero-touch health check endpoint for monitoring, Render checks, and user verification."""
    return JsonResponse({
        "status": "healthy",
        "service": "Sealox Mechanical Seals Backend API",
        "endpoints": {
            "products": "/api/products/",
            "admin_api": "/api/products/admin/",
            "django_admin": "/admin/",
        }
    })

urlpatterns = [
    path('', health_check, name='api-root-health'),
    path('health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
]

# Ensure media files can be served in production if local storage is active
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

# Serve frontend public assets in development / local mode
frontend_public = settings.BASE_DIR.parent / 'frontend' / 'public'
if frontend_public.exists():
    urlpatterns += [
        re_path(r'^(?P<path>(products|industry)/.*)$', serve, {'document_root': frontend_public}),
        re_path(r'^(?P<path>[^/]+\.(png|jpg|jpeg|svg|webp|pdf))$', serve, {'document_root': frontend_public}),
    ]

