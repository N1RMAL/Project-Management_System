from django.contrib import admin
from .models import Group, User, Task

admin.site.register(Group)
admin.site.register(User)
admin.site.register(Task)