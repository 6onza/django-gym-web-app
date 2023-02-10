from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
import stripe
import environ

from .models import Cart, CartItem, Order, OrderItem, Product
from .serializers import CartItemSerializer, OrderSerializer, ProductsSerializer

env = environ.Env()

class ProductsView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductsSerializer


stripe.api_key = env('STRIPE_SECRET_KEY')

class CartItemCreateView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user, checked_out=False).first()

        if not cart:
            cart = Cart.objects.create(user=user)
        try:
            product = Product.objects.get(id=request.data.get("product_id"))
            cart_item = CartItem.objects.create(cart=cart, product=product)

        except Product.DoesNotExist:
            return Response({"error": "Product does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            
        except IntegrityError:
            return Response({"error": "This item is already in your cart."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CartItemSerializer(cart_item)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartItemDeleteView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user, checked_out=False).first()

        if not cart:
            return Response({"error": "There is no cart for this user."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=request.data.get("product_id"))
            cart_item = CartItem.objects.filter(cart=cart, product=product).first()
            cart_item.delete()

        except Product.DoesNotExist:
            return Response({"error": "Product does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderCreateView(APIView):
    def post(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user, checked_out=False).first()

        if not cart:
            return Response({"error": "There is no cart for this user."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = CartItem.objects.filter(cart=cart)

        if not cart_items:
            return Response({"error": "The cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = 0

        for item in cart_items:
            total_price += item.product.price

        try:
            charge = stripe.Charge.create(
                amount=int(total_price * 100),
                currency="usd",
                source=request.data.get("stripeToken"),
                description="Charge for " + user.username + " - " + user.email
            )
        except stripe.error.CardError as e:
            return Response({"error": "Your card was declined."}, status=status.HTTP_400_BAD_REQUEST)
        
        order = Order.objects.create(user=user)

        for item in cart_items:
            OrderItem.objects.create(order=order, product=item.product)

        cart.checked_out = True
        cart.save()
        serializer = OrderSerializer(order)

        return Response(serializer.data, status=status.HTTP_201_CREATED)