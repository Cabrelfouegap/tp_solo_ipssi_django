from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Création du router DRF
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)

# URLs de l'application products
urlpatterns = [
    path('api/', include(router.urls)),
]