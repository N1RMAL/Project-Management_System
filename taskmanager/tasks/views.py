from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Task, Group
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
        Return groups the user is a member of.
        """
        return Group.objects.filter(members=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving user details.
    Accessible only to authenticated users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return all users in the same groups as the current user.
        """
        if self.request.user.is_superuser:
            return self.queryset
        return User.objects.filter(groups__members=self.request.user).distinct()

class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Tasks.
    Tasks are restricted to specific groups, and only members of the group can interact with them.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Define allowed group IDs as a class variable for reuse
    ALLOWED_GROUP_IDS = [1, 2, 3]

    def get_queryset(self):
        """
        Return tasks for the allowed groups the user is part of.
        Optionally filter tasks by group ID using the `group` query parameter.
        """
        group_id = self.request.query_params.get("group")
        if group_id:
            # Validate the group and check membership
            group_exists = Group.objects.filter(
                id=group_id,
                id__in=self.ALLOWED_GROUP_IDS,
                members=self.request.user
            ).exists()
            if not group_exists:
                raise PermissionDenied("You are not authorized to access this group.")
            return Task.objects.filter(group_id=group_id)

        # Return tasks for all allowed groups the user is a member of
        return Task.objects.filter(
            group__id__in=self.ALLOWED_GROUP_IDS,
            group__members=self.request.user
        )

    def perform_create(self, serializer):
        """
        Validate that the user creating the task belongs to the specified group.
        """
        group = serializer.validated_data.get("group")
        if group.id not in self.ALLOWED_GROUP_IDS:
            raise PermissionDenied("Invalid group selected for the task.")
        if not group.members.filter(id=self.request.user.id).exists():
            raise PermissionDenied("You are not authorized to create tasks for this group.")
        serializer.save()

    def perform_update(self, serializer):
        """
        Validate that the user updating the task belongs to the group.
        """
        group = serializer.instance.group
        if group.id not in self.ALLOWED_GROUP_IDS:
            raise PermissionDenied("Invalid group selected for the task.")
        if not group.members.filter(id=self.request.user.id).exists():
            raise PermissionDenied("You are not authorized to update tasks for this group.")
        serializer.save()


