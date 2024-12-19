from django.db import models

class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class User(models.Model):
    username = models.CharField(max_length=100)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username

class Task(models.Model):
    assigned_to = models.ManyToManyField(User, related_name="tasks", blank=True)
    STATUS_CHOICES = [
        ('todo', 'To-Do'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)  # New field
    assigned_to = models.ManyToManyField(User, related_name='tasks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.group.name})"

