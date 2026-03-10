from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, UserSerializer
from utils.responses import responseSuccess, responseError


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = UserSerializer(user).data
            return responseSuccess(
                data=user_data,
                status_code=status.HTTP_201_CREATED,
                message='Đăng ký thành công'
            )
        return responseError(
            message='Dữ liệu không hợp lệ',
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=serializer.errors
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view with standardized response format"""
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return responseError(
                message='Email hoặc mật khẩu không đúng',
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        tokens = serializer.validated_data
        return responseSuccess(
            data={
                'access': tokens['access'],
                'refresh': tokens['refresh']
            }
        )


class CustomTokenRefreshView(TokenRefreshView):
    """Custom token refresh view with standardized response format"""
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return responseError(
                message='Refresh token không hợp lệ hoặc đã hết hạn',
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        tokens = serializer.validated_data
        return responseSuccess(
            data={
                'access': tokens['access']
            },
            message='Làm mới token thành công'
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return responseSuccess(
            data=serializer.data,
            message='Lấy thông tin profile thành công'
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return responseSuccess(
                data=serializer.data,
                message='Cập nhật profile thành công'
            )
        return responseError(
            message='Dữ liệu không hợp lệ',
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=serializer.errors
        )
