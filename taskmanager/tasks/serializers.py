from rest_framework import serializers
from .models import Task, Group
from django.contrib.auth.models import User  # Import Django's built-in User model


class GroupSerializer(serializers.ModelSerializer):
    """
    Serializer for Group model.
    Displays the group name and associated members.
    """
    members = serializers.StringRelatedField(many=True, read_only=True)  # Display usernames of group members

    class Meta:
        model = Group
        fields = ['id', 'name', 'members']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Provides basic details for users.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Expose required fields


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task model.
    Manages group and user relationships for task creation and retrieval.
    """
    assigned_to = serializers.SerializerMethodField()
    group = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.filter(id__in=[1, 2, 3])  # Restrict to specific groups
    )  # Accept group ID for task
    group_details = GroupSerializer(read_only=True, source='group')  # Provide nested group details for GET requests
    assigned_to = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), required=False
    )  # Accept user IDs for task assignment
    assigned_to_details = UserSerializer(
        many=True, read_only=True, source='assigned_to'
    )  # Display detailed user info for GET requests

    class Meta:
        model = Task
        fields = [
            'id', 'group', 'group_details', 'name', 'description',
            'assigned_to', 'assigned_to_details', 'status', 'created_at', 'updated_at'
        ]

    def validate_group(self, value):
        """
        Ensure the group is valid and within the allowed groups.
        """
        allowed_group_ids = [1, 2, 3]
        if value.id not in allowed_group_ids:
            raise serializers.ValidationError("Please select a valid group.")
        return value

    def create(self, validated_data):
        """
        Handle task creation and assigned users.
        """
        assigned_users = validated_data.pop('assigned_to', [])
        task = Task.objects.create(**validated_data)
        if assigned_users:
            task.assigned_to.set(assigned_users)
        return task

    def update(self, instance, validated_data):
        """
        Handle task updates and manage assigned users.
        """
        assigned_users = validated_data.pop('assigned_to', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if assigned_users is not None:
            instance.assigned_to.set(assigned_users)
        return instance

