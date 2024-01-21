from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer

# Create your views here.

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

class LogoutAPIView(APIView):
    def post(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)
