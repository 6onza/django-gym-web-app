from rest_framework import serializers
from .models import Product, CartItem, Cart

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'category', 'description', 'price', 'image', 'created_at')
        read_only_fields = ('id','created_at')

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('id', 'user', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('id', 'cart', 'product')


