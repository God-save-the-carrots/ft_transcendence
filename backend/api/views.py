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

class UserAPIView(APIView):
    dummy = []
    def __init__(self):
        
        if not self.dummy:
            for i in range(43):
                self.dummy.append({
                    "id": i,
                    "intra_id": "dummy" + str(i),
                    "photo_id": i % 8,
                    "message": "dummy message" + str(i)
                })
    
    def get(self, request, intra_id):
        response_data = next((item for item in self.dummy if item['intra_id'] == intra_id), None)
        if not response_data:
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        return Response(response_data, status=status.HTTP_200_OK)
    
    def patch(self, request, intra_id):
        response_data = next((item for item in self.dummy if item['intra_id'] == intra_id), None)
        if not response_data:
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        
        request_data = request.data
        
        # Check id
        if 'id' not in request_data:
            return Response({"error": "Missing id"}, status=status.HTTP_400_BAD_REQUEST)
        if request_data['id'] != response_data['id']:
            return Response({"error": "Invalid id"}, status=status.HTTP_403_FORBIDDEN)
       
        # Update data
        if 'photo_id' in request_data:
            response_data['photo_id'] = request_data['photo_id']
        if 'message' in request_data:
            response_data['message'] = request_data['message']
        return Response(response_data, status=status.HTTP_200_OK)