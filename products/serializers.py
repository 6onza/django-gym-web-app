from rest_framework import serializers
from .models import Product

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'category', 'description', 'price', 'image', 'created_at')
        read_only_fields = ('id','created_at')

