from rest_framework import viewsets, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import Transaction
from .serializers import TransactionSerializer
from utils.responses import responseSuccess, responseError


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['type', 'category']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user).select_related('category')
        
        # Filter by month/year
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        
        if month and year:
            queryset = queryset.filter(date__month=month, date__year=year)
        elif year:
            queryset = queryset.filter(date__year=year)
            
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return responseSuccess(
            data=serializer.data,
            message='Lấy danh sách transactions thành công'
        )
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return responseSuccess(
                data=serializer.data,
                status_code=status.HTTP_201_CREATED,
                message='Tạo transaction thành công'
            )
        return responseError(
            message='Dữ liệu không hợp lệ',
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=serializer.errors
        )
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return responseSuccess(
            data=serializer.data,
            message='Lấy chi tiết transaction thành công'
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return responseSuccess(
                data=serializer.data,
                message='Cập nhật transaction thành công'
            )
        return responseError(
            message='Dữ liệu không hợp lệ',
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=serializer.errors
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return responseSuccess(
            data=None,
            status_code=status.HTTP_204_NO_CONTENT,
            message='Xóa transaction thành công'
        )
