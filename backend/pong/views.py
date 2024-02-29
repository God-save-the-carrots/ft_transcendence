import jwt
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.conf import settings

from django.utils import timezone
from .models import Pong, GameSession, Tournament
from accounts.models import User, Profile
from .serializers import CustomRankSerializer, CustomMatchesSerializer

import math

# /
class PongAPIView(APIView):
    def post(self, request):
        games_data = request.data.get('games', [])
        players_data = request.data.get('players', [])
        player_dict = {player_data['intra_id']: player_data['grade'] for player_data in players_data}

        tournament = Tournament.objects.create(game_type='pong_4')

        for game_data in games_data:
            match_type = game_data.get('match', '')
            start_time = timezone.now()
            end_time = timezone.now()

            if 'start_time' in game_data:
                start_time = timezone.datetime.fromtimestamp(game_data['start_time'])
            if 'end_time' in game_data:
                end_time = timezone.datetime.fromtimestamp(game_data['end_time'])

            game_session = GameSession.objects.create(
                tournament_id=tournament,
                match_type=match_type,
                start_time = start_time,
                end_time = end_time
            )

            scores_data = game_data.get('scores', [])
            for score_data in scores_data:
                intra_id=score_data.get('intra_id', '')

                user_id = User.objects.get(intra_id=intra_id)
                rank = player_dict.get(intra_id, 0)
                score = score_data.get('score', 0)

                Pong.objects.create(
                    game_session_id=game_session,
                    user_id=user_id,
                    rank=rank,
                    score=score
                )
        for intra_id, grade in player_dict.items():
            user_instance = User.objects.get(intra_id=intra_id)
            user_profile = Profile.objects.get(user_id=user_instance)
            if grade == 1:
                user_profile.rating += 100
            elif grade == 2:
                user_profile.rating += -20
            elif grade == 3:
                user_profile.rating += -40
            elif grade == 4:
                user_profile.rating += -60
            user_profile.save()

        response_data = {
            'tournament_id': tournament.id
        }
        return Response(response_data, status=status.HTTP_200_OK)

# /rank/
class RankAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))

            start_index = page_size * (page - 1)
            end_index = page_size * (page)

            all_users_with_profile = Profile.objects.all().select_related('user_id').order_by('-rating')
            content_length = len(all_users_with_profile)
            if start_index < 0:
                return Response({"error": "Invalid page index"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = CustomRankSerializer(all_users_with_profile[start_index:end_index], many=True)
            response_data = {
                'page': page,
                'page_size': page_size,
                'last_page_index': math.ceil(content_length / page_size),
                'content_length': content_length,
                'data' : serializer.data,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        

# /matches/<int:match_id>/
class MatchesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, match_id):
        try:
            tournament = Tournament.objects.get(id=match_id)
            serializer = CustomMatchesSerializer(tournament)
            response_data = serializer.data
            return Response(response_data, status=status.HTTP_200_OK)
        except Tournament.DoesNotExist:
            return Response({"error": "match_id not found"}, status=status.HTTP_404_NOT_FOUND)

# /ticket/
class TicketAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            intra_id = request.user.intra_id
            user_model = User.objects.get(intra_id=intra_id)
            current_time = datetime.utcnow()
            payload = {
                'exp': current_time + timedelta(minutes=15),
                'iat': current_time,
                'intra_id': user_model.intra_id,
                'photo_id': user_model.profile.photo_id,
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            return Response({'ticket': token}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)