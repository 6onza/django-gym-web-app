from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated,IsAdminUser 
from rest_framework.authentication import BasicAuthentication
from .models import Product
from .serializers import ProductsSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
       

class ProductsView(viewsets.ModelViewSet):
    
    serializer_class = ProductsSerializer
    queryset = Product.objects.all()
    
    def get(self, request, pk):
        if pk:
            product = self.queryset.get(pk=pk)
            serializer = self.serializer_class(product)

            return Response(serializer.data)
        else:
            products = self.queryset.all()
            serializer = self.serializer_class(products, many=True)
            
            return Response(serializer.data)
    
    
    def put(self, request, pk):
        product = self.queryset.get(pk=pk)
        serializer = ProductsSerializer(product, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data)
        
        return Response(serializer.errors)
    
    def delete(self, request, pk):
        product = self.queryset.get(pk=pk)
        product.delete()
        
        return Response(status=204)