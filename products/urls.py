from django.urls import path, include
from products.views import ProductsView, OrderCreateView, CartItemCreateView, CartItemDeleteView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'products', ProductsView)



urlpatterns = [
    path('', include(router.urls)),
    path('order/', OrderCreateView.as_view()),
    path('cart-add-item/', CartItemCreateView.as_view()),
    path('cart-delete-item/', CartItemDeleteView.as_view()),
]