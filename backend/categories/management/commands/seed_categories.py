from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from categories.models import Category, TransactionType

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed default categories for all users'

    def handle(self, *args, **kwargs):
        default_categories = [
            # EXPENSE
            {"name": "Ăn uống", "type": TransactionType.EXPENSE, "icon": "🍜", "color": "#FF6B6B"},
            {"name": "Đi lại", "type": TransactionType.EXPENSE, "icon": "🚗", "color": "#4ECDC4"},
            {"name": "Mua sắm", "type": TransactionType.EXPENSE, "icon": "🛍️", "color": "#45B7D1"},
            {"name": "Nhà ở & Tiện ích", "type": TransactionType.EXPENSE, "icon": "🏠", "color": "#96CEB4"},
            {"name": "Giải trí", "type": TransactionType.EXPENSE, "icon": "🎬", "color": "#FFEAA7"},
            {"name": "Sức khỏe", "type": TransactionType.EXPENSE, "icon": "💊", "color": "#DDA0DD"},
            {"name": "Giáo dục", "type": TransactionType.EXPENSE, "icon": "📚", "color": "#98D8C8"},
            {"name": "Khác (Chi)", "type": TransactionType.EXPENSE, "icon": "💸", "color": "#B8B8B8"},
            # INCOME
            {"name": "Lương", "type": TransactionType.INCOME, "icon": "💰", "color": "#2ECC71"},
            {"name": "Thưởng", "type": TransactionType.INCOME, "icon": "🎁", "color": "#3498DB"},
            {"name": "Đầu tư", "type": TransactionType.INCOME, "icon": "📈", "color": "#9B59B6"},
            {"name": "Thu nhập phụ", "type": TransactionType.INCOME, "icon": "💼", "color": "#E67E22"},
            {"name": "Khác (Thu)", "type": TransactionType.INCOME, "icon": "💵", "color": "#95A5A6"},
        ]

        users = User.objects.all()
        
        if not users.exists():
            self.stdout.write(self.style.WARNING('No users found. Create a user first.'))
            return

        for user in users:
            for cat_data in default_categories:
                category, created = Category.objects.get_or_create(
                    name=cat_data['name'],
                    type=cat_data['type'],
                    user=user,
                    defaults={
                        'icon': cat_data['icon'],
                        'color': cat_data['color'],
                        'is_default': True
                    }
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f'Created category: {category.name} for {user.email}')
                    )

        self.stdout.write(self.style.SUCCESS('Successfully seeded default categories'))
