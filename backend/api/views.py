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

class SocreAPIView(APIView):
    def get(self, request, intra_id):
        game_type = request.query_params.get('game_type', None)
        intra_id = request.query_params.get('intra_id', None)
        page = int(request.query_params.get('page', 0))
        page_size = int(request.query_params.get('page_size', 0))
        
        response_data = {
            'page': page,
            'page_size': page_size,
            'last_page_index': 1,
            'content_length': 2,
            'data': [
                {
                    'match_id': 1,
                    'game_type': 'phong_4',
                    'score': [
                        {
                            'user': {'id': 0, 'intra_id': 'main_dummy', 'photo_id': 0}, 
                            'value': 100
                        },
                        {
                            'user': {'id': 0, 'intra_id': 'dummy1', 'photo_id': 0},
                            'value': -60
                        },
                        {
                            'user': {'id': 0, 'intra_id': 'dummy2', 'photo_id': 0},
                            'value': -40
                        },
                        {
                            'user': {'id': 0, 'intra_id': 'dummy3', 'photo_id': 0},
                            'value': -20
                        },
                    ]
                },
                {
                    'match_id': 2,
                    'game_type': 'phong_4',
                    'score': [
                        {
                            'user': {'id': 0, 'intra_id': 'main_dummy', 'photo_id': 0}, 
                            'value': 100
                        },
                        {
                            'user': {'id': 0, 'intra_id': 'dummy5', 'photo_id': 0},
                            'value': -60
                        },
                        {
                            'user': {'id': 0, 'intra_id': 'dummy6', 'photo_id': 0},
                            'value': -40
                        },
                        {
                            'user': {'id': 0, 'intra_id': 'dummy7', 'photo_id': 0},
                            'value': -20
                        },
                    ]
                }
            ]
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class MatchesAPIView(APIView):
    dummy = []
    def __init__(self):
        if not self.dummy:
            for i in range(3):
                self.dummy.append({
                    "match_id": i,
                    "game_type": "phong_4",
                    "score": [
                        {
                            "user": { "id": 1, "intra_id": "main_dummy-" + str(i), "photo_id": 0 },
                            "rating": 1024,
                            "value": 100
                        },
                        {
                            "user": { "id": 4, "intra_id": "dummy", "photo_id": 0 },
                            "rating": 900,
                            "value": -20
                        },
                        {
                            "user": { "id": 3, "intra_id": "dummy", "photo_id": 0 },
                            "rating": 1100,
                            "value": -40
                        },
                        {
                            "user": { "id": 2, "intra_id": "dummy", "photo_id": 0 },
                            "rating": 1032,
                            "value": -60
                        },
                    ],
                })

    def get(self, request, match_id):
        response_data = next((item for item in self.dummy if item['match_id'] == match_id), None)
        if not response_data:
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        return Response(response_data, status=status.HTTP_200_OK)
