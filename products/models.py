from django.db import models
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

class Product(models.Model):
    
    CATEGORY_OPTIONS = (
        ('proteinas', 'proteinas'),
        ('guantes', 'guantes'),
        ('bebidas', 'bebidas'),
    )

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, blank=False)
    category = models.CharField(max_length=200, choices=CATEGORY_OPTIONS, blank=False, default=None)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to=f'{BASE_DIR}/frontend/public/products/', blank=True, null=True, max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.image.name = self.name + '.' + self.image.name.split('.')[-1]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, blank=False)
    email = models.EmailField(blank=False)
    address = models.CharField(max_length=200, blank=False)
    city = models.CharField(max_length=200, blank=False)
    state = models.CharField(max_length=200, blank=False)
    zip_code = models.CharField(max_length=200, blank=False)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.name
