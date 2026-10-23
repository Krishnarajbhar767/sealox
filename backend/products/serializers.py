import json
import re
from rest_framework import serializers
from .models import Product, ProductGalleryImage


class ProductGalleryImageSerializer(serializers.ModelSerializer):
    """Serializer for individual gallery images attached to a mechanical seal product."""
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductGalleryImage
        fields = ['id', 'image', 'static_image_path', 'url', 'caption', 'order']

    def get_url(self, gallery_image: ProductGalleryImage) -> str:
        url = gallery_image.get_image_url()
        request = self.context.get('request')
        if url and url.startswith('/media/') and request:
            return request.build_absolute_uri(url)
        return url


class ProductSerializer(serializers.ModelSerializer):
    """Public read-only serializer for storefront product cards and detail pages."""
    id = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    operatingLimits = serializers.JSONField(source='operating_limits', default=list)
    faceMaterials = serializers.JSONField(source='face_materials', default=list)
    secondarySealMaterials = serializers.JSONField(source='secondary_seal_materials', default=list)
    metalParts = serializers.JSONField(source='metal_parts', default=list)
    sealComponents = serializers.JSONField(source='seal_components', default=list)
    applications = serializers.JSONField(default=list)
    customSpecGroups = serializers.JSONField(source='custom_spec_groups', default=list, required=False)

    class Meta:
        model = Product
        fields = [
            'id',
            'slug',
            'name',
            'category',
            'subtitle',
            'image',
            'images',
            'description',
            'operatingLimits',
            'faceMaterials',
            'secondarySealMaterials',
            'metalParts',
            'sealComponents',
            'applications',
            'customSpecGroups',
            'is_active',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_id(self, catalog_product: Product) -> str:
        return catalog_product.slug or str(catalog_product.id)

    def get_image(self, catalog_product: Product) -> str:
        url = catalog_product.get_primary_image_url()
        request = self.context.get('request')
        if url and url.startswith('/media/') and request:
            return request.build_absolute_uri(url)
        return url

    def get_images(self, catalog_product: Product) -> list[str]:
        urls = catalog_product.get_all_image_urls()
        request = self.context.get('request')
        if request:
            return [request.build_absolute_uri(u) if u and u.startswith('/media/') else u for u in urls]
        return urls


class VersatileImageField(serializers.ImageField):
    """
    Accepts direct file uploads, storage path strings (e.g. 'products/seal.png'),
    full media URLs, or null to clear the image.
    Enables seamless pure-JSON mutations after image upload.
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            cleaned = data.strip()
            if not cleaned:
                return None
            if '/media/' in cleaned:
                cleaned = cleaned.split('/media/', 1)[1]
            return cleaned
        if data is None:
            return None
        return super().to_internal_value(data)


class AdminProductSerializer(serializers.ModelSerializer):
    """
    Dedicated admin serializer for full CRUD operations in the React Admin Panel.
    Supports pure JSON payloads with versatile image referencing (uploaded files or storage paths).
    """
    # 1. Explicit Fields (Rule 9)
    primary_image = VersatileImageField(required=False, allow_null=True)
    primaryImageUrl = serializers.SerializerMethodField()
    galleryImages = ProductGalleryImageSerializer(source='gallery_images', many=True, read_only=True)

    # 2. Meta Class (Rule 10)
    class Meta:
        model = Product
        fields = [
            'id',
            'slug',
            'name',
            'category',
            'subtitle',
            'description',
            'primary_image',
            'static_image_path',
            'primaryImageUrl',
            'operating_limits',
            'face_materials',
            'secondary_seal_materials',
            'metal_parts',
            'seal_components',
            'applications',
            'custom_spec_groups',
            'is_active',
            'order',
            'galleryImages',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'primaryImageUrl', 'galleryImages']

    # 3. Field Validators (Rule 11)
    def validate_name(self, product_name: str) -> str:
        cleaned_name = product_name.strip()
        if not cleaned_name:
            raise serializers.ValidationError("Product name cannot be empty.")
        return cleaned_name

    def validate_slug(self, product_slug: str) -> str:
        cleaned_slug = product_slug.strip().lower()
        if not cleaned_slug:
            raise serializers.ValidationError("Slug cannot be empty.")
        if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', cleaned_slug):
            raise serializers.ValidationError(
                "Slug can only contain lowercase alphanumeric characters and hyphens without consecutive or trailing dashes."
            )
        # Ensure unique slug if updating or creating
        existing_matches = Product.objects.filter(slug=cleaned_slug)
        if self.instance:
            existing_matches = existing_matches.exclude(pk=self.instance.pk)
        if existing_matches.exists():
            raise serializers.ValidationError(f"A product with slug '{cleaned_slug}' already exists.")
        return cleaned_slug

    # 4. Lifecycle Methods & Parsing (Rule 12)
    def to_internal_value(self, incoming_raw_payload):
        """
        Normalizes JSON fields whether sent via raw application/json or FormData strings.
        Converts Django QueryDict / MultiValueDict into a standard Python dictionary to prevent
        QueryDict stringifying parsed JSON lists into single-quoted Python representations.
        """
        if hasattr(incoming_raw_payload, 'getlist'):
            normalized_payload = {}
            for field_key in incoming_raw_payload.keys():
                normalized_payload[field_key] = incoming_raw_payload.get(field_key)
        elif hasattr(incoming_raw_payload, 'copy'):
            normalized_payload = incoming_raw_payload.copy()
        else:
            normalized_payload = dict(incoming_raw_payload)

        structured_json_fields = [
            'operating_limits',
            'face_materials',
            'secondary_seal_materials',
            'metal_parts',
            'seal_components',
            'applications',
            'custom_spec_groups',
        ]

        for json_field_name in structured_json_fields:
            if json_field_name in normalized_payload:
                field_raw_value = normalized_payload.get(json_field_name)
                parsed_value = self._parse_json_field(field_raw_value)
                normalized_payload[json_field_name] = self._sanitize_field_content(json_field_name, parsed_value)

        return super().to_internal_value(normalized_payload)

    # 5. Field Getters (Rule 12)
    def get_primaryImageUrl(self, catalog_product: Product) -> str:
        url = catalog_product.get_primary_image_url()
        request = self.context.get('request')
        if url and url.startswith('/media/') and request:
            return request.build_absolute_uri(url)
        return url

    # 6. Private Helpers (Rule 1 & Rule 12)
    def _parse_json_field(self, raw_value):
        """Safely parses stringified JSON or returns existing structured list/dict."""
        if not isinstance(raw_value, str):
            return raw_value if raw_value is not None else []

        trimmed_value = raw_value.strip()
        if not trimmed_value or trimmed_value in ('[]', '{}'):
            return []

        if trimmed_value.startswith('[') or trimmed_value.startswith('{'):
            try:
                return json.loads(trimmed_value)
            except (json.JSONDecodeError, ValueError):
                return []

        return []

    def _sanitize_field_content(self, field_name: str, parsed_content):
        """Discards blank rows, trims strings, and sorts components to keep database clean."""
        if not isinstance(parsed_content, list):
            return parsed_content

        if field_name in ('operating_limits', 'face_materials'):
            cleaned_rows = []
            for item in parsed_content:
                if isinstance(item, dict):
                    clean_label = str(item.get('label', '')).strip()
                    clean_val = str(item.get('value', '')).strip()
                    if clean_label or clean_val:
                        cleaned_rows.append({'label': clean_label, 'value': clean_val})
            return cleaned_rows

        if field_name in ('secondary_seal_materials', 'metal_parts', 'applications'):
            seen_set = set()
            cleaned_tags = []
            for tag in parsed_content:
                clean_tag = str(tag).strip()
                if clean_tag and clean_tag.lower() not in seen_set:
                    seen_set.add(clean_tag.lower())
                    cleaned_tags.append(clean_tag)
            return cleaned_tags

        if field_name == 'seal_components':
            cleaned_components = []
            for item in parsed_content:
                if isinstance(item, dict):
                    clean_name = str(item.get('name', '')).strip()
                    try:
                        clean_code = int(item.get('code', 1))
                    except (ValueError, TypeError):
                        clean_code = 1
                    if clean_name:
                        cleaned_components.append({'code': clean_code, 'name': clean_name})
            cleaned_components.sort(key=lambda component_item: component_item['code'])
            return cleaned_components

        return parsed_content

