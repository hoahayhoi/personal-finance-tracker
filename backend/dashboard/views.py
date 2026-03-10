from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Q
from transactions.models import Transaction
from categories.models import TransactionType
from datetime import datetime
from utils.responses import responseSuccess, responseError


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            month = request.query_params.get('month')
            year = request.query_params.get('year')

            # Base queryset
            queryset = Transaction.objects.filter(user=user)

            # Filter by month/year
            if month and year:
                queryset = queryset.filter(date__month=month, date__year=year)
            elif year:
                queryset = queryset.filter(date__year=year)

            # Calculate totals
            income = queryset.filter(type=TransactionType.INCOME).aggregate(
                total=Sum('amount')
            )['total'] or 0

            expense = queryset.filter(type=TransactionType.EXPENSE).aggregate(
                total=Sum('amount')
            )['total'] or 0

            balance = income - expense

            # Category breakdown
            category_breakdown = queryset.values(
                'category__id', 'category__name', 'category__color', 'type'
            ).annotate(total=Sum('amount')).order_by('-total')

            # Daily data (for charts)
            daily_data = []
            if month and year:
                from calendar import monthrange
                days_in_month = monthrange(int(year), int(month))[1]
                
                for day in range(1, days_in_month + 1):
                    date_str = f"{year}-{month.zfill(2)}-{str(day).zfill(2)}"
                    day_transactions = queryset.filter(date__date=date_str)
                    
                    day_income = day_transactions.filter(type=TransactionType.INCOME).aggregate(
                        total=Sum('amount')
                    )['total'] or 0
                    
                    day_expense = day_transactions.filter(type=TransactionType.EXPENSE).aggregate(
                        total=Sum('amount')
                    )['total'] or 0
                    
                    daily_data.append({
                        'date': date_str,
                        'income': float(day_income),
                        'expense': float(day_expense)
                    })

            data = {
                'balance': float(balance),
                'totalIncome': float(income),
                'totalExpense': float(expense),
                'dailyData': daily_data,
                'categoryBreakdown': [
                    {
                        'categoryId': item['category__id'],
                        'name': item['category__name'],
                        'color': item['category__color'],
                        'total': float(item['total']),
                        'type': item['type']
                    }
                    for item in category_breakdown
                ]
            }

            return responseSuccess(
                data=data,
                message='Lấy dashboard summary thành công'
            )
            
        except Exception as e:
            return responseError(
                message=f'Lỗi khi lấy dashboard summary: {str(e)}',
                status_code=500
            )
