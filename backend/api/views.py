from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import User, Profile
import math

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
            game_type = request.GET.get('game_type', None)
            page = int(request.GET.get('page', 0))
            page_size = int(request.GET.get('page_size', 20))

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
            game_type = request.GET.get('game_type', None)
            page = int(request.GET.get('page', 0))
            page_size = int(request.GET.get('page_size', 20))

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
        try:
            tournament = Tournament.objects.get(id=match_id)
            serializer = CustomMatchesSerializer(tournament)
            response_data = serializer.data
            return Response(response_data, status=status.HTTP_200_OK)
        except Tournament.DoesNotExist:
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

# TODO : view 파일 분리 필요.
# api/game/pong/score/<str:intra_id>/profile :
class ScoreProfileAPIView(APIView):
    def get(self, request, intra_id):
        try:
            user_instance = User.objects.get(intra_id=intra_id)
            rating_for_user = Profile.objects.all().order_by('-rating')
            user_rating = user_instance.profile.rating
            rank_for_user = rating_for_user.filter(rating__gt=user_rating).count() + 1
            serializer = CustomUserSerializer(user_instance)
            response_data = {
                'user': serializer.data, 
                'rank': rank_for_user,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

# api/game/pong/score/<str:intra_id>/play-time : 게임 시간.
# api/game/pong/score/<str:intra_id>/winning-rate : 승률.
# api/game/pong/score/<str:intra_id>/goals-against-average : 내가 낸 점수와 상대가 낸 점수를 더한 결과비
# api/game/pong/score/<str:intra_id>/winning-percentage : 개안 승률, 전체유저의 평균 승률, 1등 유저의 승률
        