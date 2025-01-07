from django.db import models
from django.contrib.auth.models import User


class Group(models.Model):
    """
    Represents a group to which users and tasks belong.
    """
    name = models.CharField(max_length=100, unique=True)
    members = models.ManyToManyField(
        User,
        related_name="custom_groups",
        through="GroupMember",  # Use explicit through model for tasks_group_members
    )

    def __str__(self):
        return self.name


class GroupMember(models.Model):
    """
    Represents the explicit Many-to-Many relationship table (tasks_group_members).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    class Meta:
        db_table = "tasks_group_members"  # Use the existing table
        unique_together = ("user", "group")


class Task(models.Model):
    """
    Represents a task that can be assigned to users within a group.
    """
    STATUS_CHOICES = [
        ("todo", "To-Do"),
        ("in-progress", "In Progress"),
        ("completed", "Completed"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    assigned_to = models.ManyToManyField(User, related_name="assigned_tasks", blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="todo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.group.name})"
