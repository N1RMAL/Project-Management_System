from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Task, Group, UserGroup
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
    Accessible to anyone. Filters users by group if the current user is authenticated.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view users

    def get_queryset(self):
        return User.objects.all()
    #  current_user = self.request.user

    #  if current_user.is_authenticated:
    #     # Get group IDs the current user belongs to
    #     user_groups = UserGroup.objects.filter(user=current_user).values_list("group", flat=True)
        
    #     # Return users who belong to the same groups as the current user
    #     users = User.objects.filter(usergroup__group__in=user_groups).distinct()
    #     print("Fetched users in get_queryset:", users)  # Debugging log
    #     return users

    # # For unauthenticated users, return none
    #  return User.objects.none()


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Tasks.
    Allow anyone to view tasks, but keep write operations restricted if needed.
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = []  # Remove authentication requirement for viewing tasks

    def get_queryset(self):
        """
        Return tasks filtered by group ID if provided, otherwise return all tasks.
        """
        group_id = self.request.query_params.get("group")
        if group_id:
            # Validate that the group exists
            group = Group.objects.filter(id=group_id).first()
            if not group:
                raise PermissionDenied("The selected group does not exist.")
            return Task.objects.filter(group=group)

        # Return all tasks if no group ID is specified
        return Task.objects.all()

    def perform_create(self, serializer):
        """
        Allow only valid group-related task creation.
        Remove this method if you want to restrict task creation entirely.
        """
        group = serializer.validated_data.get("group")
        if not group:
            raise PermissionDenied("A valid group must be selected.")
        serializer.save()

    def perform_update(self, serializer):
        """
        Restrict updates to ensure tasks belong to valid groups.
        Remove this method if update functionality is restricted.
        """
        group = serializer.instance.group
        if not group:
            raise PermissionDenied("Task must be associated with a valid group.")
        serializer.save()
