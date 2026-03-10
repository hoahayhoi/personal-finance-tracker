from rest_framework import viewsets, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category
from .serializers import CategorySerializer
from utils.responses import responseSuccess, responseError


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type']

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return responseSuccess(
            data=serializer.data,
            message='Lấy danh sách categories thành công'
        )
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return responseSuccess(
                data=serializer.data,
                status_code=status.HTTP_201_CREATED,
                message='Tạo category thành công'
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
            message='Lấy chi tiết category thành công'
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return responseSuccess(
                data=serializer.data,
                message='Cập nhật category thành công'
            )
        return responseError(
            message='Dữ liệu không hợp lệ',
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=serializer.errors
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if category has transactions
        if instance.transaction_set.exists():
            return responseError(
                message='Không thể xóa category đang có giao dịch liên kết',
                status_code=status.HTTP_409_CONFLICT
            )
        
        instance.delete()
        return responseSuccess(
            data=None,
            status_code=status.HTTP_204_NO_CONTENT,
            message='Xóa category thành công'
        )
