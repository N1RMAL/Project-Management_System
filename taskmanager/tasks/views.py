from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Task, Group, GroupMember
from .serializers import TaskSerializer, UserSerializer, GroupSerializer
from django.contrib.auth.models import User


class GroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Groups.
    Authenticated users can access groups they are part of.
    """
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return groups the authenticated user is a member of.
        """
        user = self.request.user
        return Group.objects.filter(members=user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving user details.
    Filters users by group if the current user is authenticated.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Allow only authenticated users

    def get_queryset(self):
        """
        Return users in the same groups as the authenticated user.
        """
        user = self.request.user
        if user.is_authenticated:
            # Get group IDs the current user belongs to
            user_groups = GroupMember.objects.filter(user=user).values_list("group", flat=True)
            # Return users in the same groups
            return User.objects.filter(groups__id__in=user_groups).distinct()
        return User.objects.none()


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Tasks.
    Allow anyone to view tasks, but restrict write operations to authenticated users.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view tasks

    def get_queryset(self):
        """
        Return tasks filtered by group ID if provided, otherwise return all tasks.
        """
        group_id = self.request.query_params.get("group")
        if group_id:
            group = Group.objects.filter(id=group_id).first()
            if not group:
                raise PermissionDenied("The selected group does not exist.")
            return Task.objects.filter(group=group)
        return Task.objects.all()

    def perform_create(self, serializer):
        """
        Ensure that tasks are created only for valid groups.
        """
        group = serializer.validated_data.get("group")
        if not group:
            raise PermissionDenied("A valid group must be selected.")
        serializer.save()

    def perform_update(self, serializer):
        """
        Restrict updates to ensure tasks belong to valid groups.
        """
        group = serializer.instance.group
        if not group:
            raise PermissionDenied("Task must be associated with a valid group.")
        serializer.save()
