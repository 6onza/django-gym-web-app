from django.db import models
from pathlib import Path
import os
from django.contrib.auth.models import User

BASE_DIR = Path(__file__).resolve().parent.parent

class Product(models.Model):
    
    CATEGORY_OPTIONS = (
        ('proteinas', 'proteinas'),
        ('guantes', 'guantes'),
        ('bebidas', 'bebidas'),
    )

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


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    checked_out = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return self.product.name

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id) + ' - ' + self.user.username 

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return self.product.name