from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['date', 'type', 'amount', 'category', 'user', 'note', 'created_at']
    list_filter = ['type', 'date', 'category', 'created_at']
    search_fields = ['note', 'user__email', 'category__name']
    ordering = ['-date', '-created_at']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
