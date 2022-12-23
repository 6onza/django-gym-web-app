from django.urls import path, include
from products.views import ProductsView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'products', ProductsView)



urlpatterns = [
    path('', include(router.urls)),
]