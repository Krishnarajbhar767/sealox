from django.db import models, transaction
from django.utils.text import slugify


class Product(models.Model):
    name = models.CharField(
        max_length=255,
        help_text="Full product title, e.g. 'CLOSE / STOCK TYPE ELASTOMER UNBALANCED SEAL'"
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="URL-friendly identifier, e.g. 'close-stock-type-elastomer-unbalanced-seal'"
    )
    category = models.CharField(
        max_length=255,
        default='Mechanical Seals • Elastomer Bellows',
        help_text="Category badge, e.g. 'Mechanical Seals • Elastomer Bellows'"
    )
    subtitle = models.CharField(
        max_length=255,
        blank=True,
        help_text="Short subtitle, e.g. 'Close Stock Type Elastomer Unbalanced Shaft Seal'"
    )
    description = models.TextField(
        blank=True,
        help_text="Detailed engineering and application description"
    )

    # Primary Display Image
    primary_image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        help_text="Upload product photo directly (supports Cloudinary or local media storage)"
    )
    static_image_path = models.CharField(
        max_length=500,
        blank=True,
        help_text="Fallback static image path, e.g. '/products/close-seal-photo.png'"
    )

    # Structured Catalog Specifications (JSON format)
    operating_limits = models.JSONField(
        default=list,
        blank=True,
        help_text='List of objects: [{"label": "Seal Size", "value": "12mm to 50mm"}, {"label": "Pressure", "value": "8 kg/cm²"}]'
    )
    face_materials = models.JSONField(
        default=list,
        blank=True,
        help_text='List of objects: [{"label": "Rotary Face", "value": "Carbon, Silicon, TC"}, {"label": "Stationary Seats", "value": "Silicon, TC, SS, Ceramic"}]'
    )
    secondary_seal_materials = models.JSONField(
        default=list,
        blank=True,
        help_text='List of strings: ["Viton", "NBR", "EPDM", "Silicon"]'
    )
    metal_parts = models.JSONField(
        default=list,
        blank=True,
        help_text='List of strings: ["SS304", "SS316"]'
    )
    seal_components = models.JSONField(
        default=list,
        blank=True,
        help_text='List of numbered part callouts: [{"code": 1, "name": "Elastomer Bellow"}, {"code": 2, "name": "SS Casing"}]'
    )
    applications = models.JSONField(
        default=list,
        blank=True,
        help_text='List of strings: ["Chemical Plant", "Oil Refinery", "Water"]'
    )
    custom_spec_groups = models.JSONField(
        default=list,
        blank=True,
        help_text='Optional custom categories: [{"groupTitle": "...", "items": [{"label": "...", "value": "..."}]}]'
    )

    # Publishing and ordering
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Controls visibility across the storefront and API"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display ordering (0 = top priority)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Catalog Product'
        verbose_name_plural = 'Catalog Products'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or 'product'
            candidate_slug = base_slug
            slug_counter = 1
            existing_query = Product.objects.filter(slug=candidate_slug)
            if self.pk:
                existing_query = existing_query.exclude(pk=self.pk)
            while existing_query.exists():
                slug_counter += 1
                candidate_slug = f"{base_slug}-{slug_counter}"
                existing_query = Product.objects.filter(slug=candidate_slug)
                if self.pk:
                    existing_query = existing_query.exclude(pk=self.pk)
            self.slug = candidate_slug
        super().save(*args, **kwargs)

    def get_primary_image_url(self) -> str:
        """Returns the primary image URL, resolving Cloudinary / local media / static fallback."""
        if self.primary_image:
            return self.primary_image.url
        if self.static_image_path:
            return self.static_image_path
        return '/hero_image.png'

    def get_all_image_urls(self) -> list[str]:
        """Returns array of all images (primary image + gallery images)."""
        image_urls: list[str] = []
        primary_url = self.get_primary_image_url()
        if primary_url:
            image_urls.append(primary_url)

        for gallery_item in self.gallery_images.all():
            gallery_item_url = gallery_item.get_image_url()
            if gallery_item_url and gallery_item_url not in image_urls:
                image_urls.append(gallery_item_url)

        return image_urls if image_urls else ['/hero_image.png']

    @transaction.atomic
    def duplicate_as_template(self) -> 'Product':
        """
        Creates a draft duplicate copy of the product and clones its gallery images.
        Follows Thin Views pattern by encapsulating duplication logic inside the Model.
        """
        base_slug = f"{self.slug}-copy"
        slug_candidate = base_slug
        slug_counter = 1
        while Product.objects.filter(slug=slug_candidate).exists():
            slug_counter += 1
            slug_candidate = f"{base_slug}-{slug_counter}"

        duplicated_product = Product.objects.create(
            name=f"{self.name} (Copy)",
            slug=slug_candidate,
            category=self.category,
            subtitle=self.subtitle,
            description=self.description,
            primary_image=self.primary_image,
            static_image_path=self.static_image_path,
            operating_limits=self.operating_limits,
            face_materials=self.face_materials,
            secondary_seal_materials=self.secondary_seal_materials,
            metal_parts=self.metal_parts,
            seal_components=self.seal_components,
            applications=self.applications,
            custom_spec_groups=self.custom_spec_groups,
            is_active=False,
            order=self.order + 1,
        )

        for gallery_image_record in self.gallery_images.all():
            ProductGalleryImage.objects.create(
                product=duplicated_product,
                image=gallery_image_record.image,
                static_image_path=gallery_image_record.static_image_path,
                caption=gallery_image_record.caption,
                order=gallery_image_record.order,
            )

        return duplicated_product

    def __str__(self):
        return f"{self.name} ({self.category})"


class ProductGalleryImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name='gallery_images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to='products/gallery/',
        blank=True,
        null=True,
        help_text="Upload technical drawing, cross-section schematic, or secondary photo"
    )
    static_image_path = models.CharField(
        max_length=500,
        blank=True,
        help_text="Fallback static path, e.g. '/products/close-seal-diagram.png'"
    )
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'

    def get_image_url(self) -> str:
        if self.image:
            return self.image.url
        if self.static_image_path:
            return self.static_image_path
        return ''

    def __str__(self):
        return f"Image for {self.product.name} (#{self.order})"
