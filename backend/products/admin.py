from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductGalleryImage


admin.site.site_header = "Sealox Administration"
admin.site.site_title = "Sealox Admin"


class ProductGalleryImageInline(admin.TabularInline):
    model = ProductGalleryImage
    extra = 1
    fields = ('image_preview', 'image', 'static_image_path', 'caption', 'order')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        url = obj.get_image_url()
        if url:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px;" />',
                url
            )
        return format_html('<span style="color: #999;">No image</span>')
    image_preview.short_description = 'Preview'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'image_thumbnail',
        'name',
        'category',
        'is_active',
        'order',
        'updated_at',
    )
    list_display_links = ('image_thumbnail', 'name')
    list_filter = ('is_active', 'category')
    search_fields = ('name', 'slug', 'category', 'description')
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductGalleryImageInline]

    def image_thumbnail(self, obj):
        url = obj.get_primary_image_url()
        if url:
            return format_html(
                '<img src="{}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 4px;" />',
                url
            )
        return format_html('<span style="color: #999;">No photo</span>')
    image_thumbnail.short_description = 'Photo'
