from django.contrib import admin
from .models import Group, Task

# Register the Group model
@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

# Register the Task model
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status', 'group', 'created_at', 'updated_at')
    search_fields = ('name', 'status')
    list_filter = ('status', 'group')
    filter_horizontal = ('assigned_to',)
