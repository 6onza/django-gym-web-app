from django.db import models

class Product(models.Model):
    
    CATEGORY_OPTIONS = (
        ('Notebooks', 'Notebooks'),
        ('PCs', 'PCs'),
        ('Monitors', 'Monitors'),
        ('Mouses', 'Mouses'),
        ('Keyboards', 'Keyboards'),
        ('Headphones', 'Headphones'),
    )

    id = models.IntegerField(primary_key=True, auto_created=True, unique=True, editable=False)
    name = models.CharField(max_length=200, blank=False)
    category = models.CharField(max_length=200, choices=CATEGORY_OPTIONS, blank=False, default=None)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.image.name = self.name + "." + self.image.name.split('.')[-1]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
