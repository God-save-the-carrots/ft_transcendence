from django.shortcuts import render
from django.db.models import Sum, F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from accounts.models import User, Profile
from pong.models import Pong, Tournament

from .serializers import *

import math

# game/pong/score/<str:intra_id>/
class ScoreAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, intra_id):
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        start_index = page_size * (page - 1)
        end_index = page_size * (page)
        try:
            user = User.objects.get(intra_id=intra_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user_tournaments = Tournament.objects.filter(
            gamesession__pong__user_id=user
        ).distinct()
        content_length = len(user_tournaments)
        if start_index < 0:
            return Response({"error": "Invalid page index"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CustomScoreSerializer(user_tournaments[start_index:end_index], many=True)
        response_data = {
            'page': page,
            'page_size': page_size,
            'last_page_index': math.ceil(content_length / page_size),
            'content_length': content_length,
            'data' : serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


# api/game/pong/score/<str:intra_id>/profile :
class ScoreProfileAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# api/game/pong/score/<str:intra_id>/play-time : 게임 시간.
class ScorePlayTimeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, intra_id):
        try:
            user_instance = User.objects.get(intra_id=intra_id)
            user_pongs = Pong.objects.filter(user_id=user_instance)
            total_time_seconds = sum(
                (pong.game_session_id.end_time - pong.game_session_id.start_time).total_seconds()
                for pong in user_pongs
            )

            total_time_minutes = int(total_time_seconds / 60)

            users_with_total_time = User.objects.annotate(
                total_play_time=Sum(
                    F('pong__game_session_id__end_time') - F('pong__game_session_id__start_time'),
                    output_field=models.DurationField()
                )
            ).order_by('-total_play_time')

            users_list = [user for user in users_with_total_time if user.total_play_time is not None]

            play_time_rank = next((i + 1 for i, user in enumerate(users_list) if user.intra_id == intra_id), -1)
            response_data = {
                'minutes': total_time_minutes,
                'play_time_rank': play_time_rank,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# api/game/pong/score/<str:intra_id>/winning-rate : 승률.
class ScoreWinningRateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, intra_id):
        try:
            user_instance = User.objects.get(intra_id=intra_id)
            user_pongs = Pong.objects.filter(user_id=user_instance).distinct('game_session_id__tournament_id')
            total_round = user_pongs.count()
            winning_round = user_pongs.filter(rank=1).count()
            losing_round = user_pongs.exclude(rank=1).count()
            response_data = {
                'intra_id': intra_id,
                'total_round': total_round,
                'winning_round': winning_round,
                'losing_round': losing_round,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# api/game/pong/score/<str:intra_id>/goals-against-average : 내가 낸 점수와 상대가 낸 점수를 더한 결과비
class ScoreGoalsAgainstAverageAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, intra_id):
        try:
            user_instance = User.objects.get(intra_id=intra_id)
            user_pongs = Pong.objects.filter(user_id=user_instance)
            enemy_pongs= Pong.objects.filter(
                game_session_id__in=user_pongs.values('game_session_id'),
            ).exclude(user_id=user_instance)
            user_score = user_pongs.aggregate(user_score=Sum('score'))['user_score']
            enemy_score = enemy_pongs.aggregate(enemy_score=Sum('score'))['enemy_score']
            response_data = {
                'user_score': user_score,
                'enemy_score': enemy_score,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# api/game/pong/score/<str:intra_id>/winning-percentage : 개인 승률, 전체유저의 평균 승률, 1등 유저의 승률
class ScoreWinningPercentageAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, intra_id):
        try:
            user_instance = User.objects.get(intra_id=intra_id)
            all_instance = User.objects.all()
            serializer = CustomWinningPercentageSerializer(all_instance, many=True)
            sorted_serializer_data = sorted(serializer.data, key=lambda x: x['winning_percentage'], reverse=True)

            winning_percentages_only = [item['winning_percentage'] for item in sorted_serializer_data]
            total_winning_percentage = sum(winning_percentages_only)

            user_winning_percentage = CustomWinningPercentageSerializer(user_instance).data
            average_winning_percentage = int(total_winning_percentage / len(sorted_serializer_data) if len(sorted_serializer_data) > 0 else 0)
            highest_winning_percentage = sorted_serializer_data[0]
            response_data = {
                'highest_winning_percentage': highest_winning_percentage,
                'user_winning_percentage': user_winning_percentage,
                'average_winning_percentage': average_winning_percentage,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
