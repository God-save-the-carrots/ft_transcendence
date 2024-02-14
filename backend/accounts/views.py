from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import User, Profile
from .serializers import *

# Create your views here.

# login
# oauth 후 작업필요.
class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
             return Response({"error": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)
        code = serializer.validated_data['code']

        response_data = {
            "id": 42,
            "intra_id": "dummy42",
            "photo_id": 0,
            "message": "dummy message42"
        }
        return Response(response_data, status=status.HTTP_200_OK)

# logout
# oauth 후 작업필요.
class LogoutAPIView(APIView):
    def post(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)

# user/<str:intra_id>/
class UserAPIView(APIView):
    def get(self, request, intra_id):
        try:
            user_model = User.objects.get(intra_id=intra_id)
            serializer = CustomUserSerializer(user_model)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, intra_id):
        try:
            profile_instance = Profile.objects.get(user_id__intra_id=intra_id)
        except Profile.DoesNotExist:
            return Response(serializer.data, status=status.HTTP_404_NOT_FOUND)

        if 'photo_id' in request.data:
            profile_instance.photo_id = request.data['photo_id']
        if 'message' in request.data:
            profile_instance.message = request.data['message']
        
        profile_instance.save()

        serializer = ProfileSerializer(profile_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)