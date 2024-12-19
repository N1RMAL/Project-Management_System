from rest_framework import serializers
from .models import Task, User, Group

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'group']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all()
    )  # Accept user IDs for POST/PUT requests

    assigned_to_details = UserSerializer(
        many=True, read_only=True, source='assigned_to'
    )  # Nested representation for GET requests

    class Meta:
        model = Task
        fields = [
            'id', 'name', 'description', 'assigned_to', 'assigned_to_details',
            'status', 'created_at', 'updated_at'
        ]
