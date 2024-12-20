from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, UserViewSet, GroupViewSet

# Initialize the DRF router
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')  # Task endpoints
router.register(r'users', UserViewSet, basename='user')  # User endpoints
router.register(r'groups', GroupViewSet, basename='group')  # Group endpoints

# Define urlpatterns
urlpatterns = [
    path('api/', include(router.urls)),  # Prefix with 'api/' for clarity
    path('', include(router.urls)),  # Add fallback route for easier testing (optional)
]

