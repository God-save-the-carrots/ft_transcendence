from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import User, Profile

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

# TODO : UserAPIView 추가적인 작업필요.
class UserAPIView(APIView):
    def get(self, request, intra_id):
        try:
            user_model = User.objects.get(intra_id=intra_id)
            serializer = CustomUserSerializer(user_model)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(serializer.data, status=status.HTTP_404_NOT_FOUND)
    
# class UserAPIView(APIView):
#     dummy = []
#     def __init__(self):
        
#         if not self.dummy:
#             for i in range(43):
#                 self.dummy.append({
#                     "id": i,
#                     "intra_id": "dummy" + str(i),
#                     "photo_id": i % 8,
#                     "message": "dummy message" + str(i)
#                 })
    
#     def get(self, request, intra_id):
#         response_data = next((item for item in self.dummy if item['intra_id'] == intra_id), None)
#         if not response_data:
#             return Response(response_data, status=status.HTTP_404_NOT_FOUND)
#         return Response(response_data, status=status.HTTP_200_OK)
    
#     def patch(self, request, intra_id):
#         response_data = next((item for item in self.dummy if item['intra_id'] == intra_id), None)
#         if not response_data:
#             return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        
#         request_data = request.data
        
#         # Check id
#         if 'id' not in request_data:
#             return Response({"error": "Missing id"}, status=status.HTTP_400_BAD_REQUEST)
#         if request_data['id'] != response_data['id']:
#             return Response({"error": "Invalid id"}, status=status.HTTP_403_FORBIDDEN)
       
#         # Update data
#         if 'photo_id' in request_data:
#             response_data['photo_id'] = request_data['photo_id']
#         if 'message' in request_data:
#             response_data['message'] = request_data['message']
#         return Response(response_data, status=status.HTTP_200_OK)

class SocreAPIView(APIView):
    dummy = {
        'page': None,
        'page_size': None,
        'last_page_index': 2,
        'content_length': 20,
        'data': []
    }
    defult_dummy = []

    for i in range(11):
        dummy_entry = {
            'match_id': i + 1,
            'game_type': 'phong_4',
            'score': [
                { 'user': {'id': (i * 3 + 1), 'intra_id': f'main_dummy', 'photo_id': i % 9},  'value': 100 },
                { 'user': {'id': (i * 3 + 4), 'intra_id': f'dummy-{i * 3 + 1}', 'photo_id': (i + 1) % 9}, 'value': -60 },
                { 'user': {'id': (i * 3 + 3), 'intra_id': f'dummy-{i * 3 + 2}', 'photo_id': (i + 2) % 9}, 'value': -40 },
                { 'user': {'id': (i * 3 + 5), 'intra_id': f'dummy-{i * 3 + 3}', 'photo_id': (i + 3) % 9}, 'value': -20 },
            ]
        }
        defult_dummy.append(dummy_entry)
    dummy['data'] = defult_dummy


    def get(self, request, intra_id):
        game_type = request.query_params.get('game_type', None)
        intra_id = request.query_params.get('intra_id', None)
        page = int(request.query_params.get('page', 0))
        page_size = int(request.query_params.get('page_size', 10))

        response_data = self.dummy
        response_data['page'] = page
        response_data['page_size'] = page_size
        return Response(response_data, status=status.HTTP_200_OK)
    
class MatchesAPIView(APIView):
    dummy = []
    def __init__(self):
        if not self.dummy:
            for i in range(11):
                self.dummy.append({
                    "match_id": i + 1,
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
