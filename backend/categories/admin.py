from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'icon', 'color', 'is_default', 'user', 'created_at']
    list_filter = ['type', 'is_default', 'created_at']
    search_fields = ['name', 'user__email']
    ordering = ['type', 'name']
    readonly_fields = ['created_at', 'updated_at']
