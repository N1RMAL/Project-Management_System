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

    def get_queryset(self):
        """
        Return tasks for the groups the user is part of.
        Optionally filter tasks by group ID using the `group` query parameter.
        """
        group_id = self.request.query_params.get("group")
        if group_id:
            group = Group.objects.filter(id=group_id, members=self.request.user).first()
            if not group:
                raise PermissionDenied("You are not authorized to access this group.")
            return Task.objects.filter(group=group)
        return Task.objects.filter(group__members=self.request.user)

    def perform_create(self, serializer):
        """
        Validate that the user creating the task belongs to the specified group.
        """
        group = serializer.validated_data.get("group")
        if self.request.user not in group.members.all():
            raise PermissionDenied("You are not authorized to create tasks for this group.")
        serializer.save()

    def perform_update(self, serializer):
        """
        Validate that the user updating the task belongs to the group.
        """
        group = serializer.instance.group
        if self.request.user not in group.members.all():
            raise PermissionDenied("You are not authorized to update tasks for this group.")
        serializer.save()
