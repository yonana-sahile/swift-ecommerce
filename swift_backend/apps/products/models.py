from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    reviews_count = models.IntegerField(default=0)
    category = models.CharField(max_length=50)
    image = models.URLField()
    secondary_image = models.URLField()
    description = models.TextField()
    specifications = models.JSONField(default=dict)
    features = models.JSONField(default=list)
    stock = models.IntegerField(default=0)
    color_options = models.JSONField(default=list)  # [{"name": "Natural", "hex": "#E8D8C8"}]
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
