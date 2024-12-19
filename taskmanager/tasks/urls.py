from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, UserViewSet, GroupViewSet

# Initialize the DRF router
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')  # Task endpoints
router.register(r'users', UserViewSet, basename='users')  # User endpoints
router.register(r'groups', GroupViewSet, basename='groups')  # Group endpoints

# Define urlpatterns
urlpatterns = [
    path('api/', include(router.urls)),  # Prefix with 'api/' for clarity
]
