from django.db import models
from django.contrib.auth.models import User


class UserGroup(models.Model):
    """
    Intermediate table connecting User and Group.
    Maps to the existing `tasks_user` table in the database.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey("Group", on_delete=models.CASCADE)

    class Meta:
        db_table = "tasks_user"  # Explicitly map to the existing table
        unique_together = ("user", "group")  # Prevent duplicate entries


class Group(models.Model):
    """
    Represents a group to which users and tasks belong.
    """
    name = models.CharField(max_length=100, unique=True)
    members = models.ManyToManyField(
        User,
        related_name="custom_groups",
        through="UserGroup",  # Use the `tasks_user` table
    )

    def __str__(self):
        return self.name


class Task(models.Model):
    """
    Represents a task that can be assigned to users within a group.
    """
    STATUS_CHOICES = [
        ('todo', 'To-Do'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)  # Link to a group
    assigned_to = models.ManyToManyField(User, related_name="assigned_tasks", blank=True)  # Link to users
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.group.name})"
