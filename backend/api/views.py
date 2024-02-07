from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import User, Profile
import math

# Create your views here.

# login
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
            return Response(serializer.data, status=status.HTTP_404_NOT_FOUND)
    
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


# game/pong/rank/
# TODO : page에 따라 연산에 맞는 컨텐츠를 반환해주는 함수필요.
class RankAPIView(APIView):
    def get(self, request):
        try:
            game_type = request.GET.get('game_type')
            page = request.GET.get('page', 0)
            page_size = request.GET.get('page_size', 20)

            all_users_with_profile = Profile.objects.all().select_related('user_id').order_by('-rating')
            serializer = CustomRankSerializer(all_users_with_profile, many=True)
            content_length = len(serializer.data)
            response_data = {
                'page': page,
                'page_size': page_size,
                'last_page_index': math.ceil(content_length / page_size),
                'content_length': content_length,
                'data' : serializer.data,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)


# game/pong/score/<str:intra_id>/
class ScoreAPIView(APIView):
    def get(self, request, intra_id):
        try:
            game_type = request.GET.get('game_type')
            page = request.GET.get('page', 0)
            page_size = request.GET.get('page_size', 20)

            user = User.objects.get(intra_id=intra_id)
            user_tournaments = Tournament.objects.filter(
                gamesession__pong__user_id=user
            ).distinct()
            serializer = CustomScoreSerializer(user_tournaments, many=True)
            content_length = len(serializer.data)
            response_data = {
                'page': page,
                'page_size': page_size,
                'last_page_index': math.ceil(content_length / page_size),
                'content_length': content_length,
                'data' : serializer.data,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
    

# game/pong/matches/<int:match_id>/
class MatchesAPIView(APIView):
    def get(self, request, match_id):
        pass

# # game/pong/matches/<int:match_id>/
# class MatchesAPIView(APIView):
#     dummy = []
#     def __init__(self):
#         if not self.dummy:
#             for i in range(11):
#                 self.dummy.append({
#                     "match_id": i + 1,
#                     "game_type": "Pong_4",
#                     "score": [
#                         {
#                             "user": { "id": 1, "intra_id": "main_dummy-" + str(i), "photo_id": 0 },
#                             "rating": 1024,
#                             "value": 100
#                         },
#                         {
#                             "user": { "id": 4, "intra_id": "dummy", "photo_id": 0 },
#                             "rating": 900,
#                             "value": -20
#                         },
#                         {
#                             "user": { "id": 3, "intra_id": "dummy", "photo_id": 0 },
#                             "rating": 1100,
#                             "value": -40
#                         },
#                         {
#                             "user": { "id": 2, "intra_id": "dummy", "photo_id": 0 },
#                             "rating": 1032,
#                             "value": -60
#                         },
#                     ],
#                 })

#     def get(self, request, match_id):
#         response_data = next((item for item in self.dummy if item['match_id'] == match_id), None)
#         if not response_data:
#             return Response(response_data, status=status.HTTP_404_NOT_FOUND)
#         return Response(response_data, status=status.HTTP_200_OK)
