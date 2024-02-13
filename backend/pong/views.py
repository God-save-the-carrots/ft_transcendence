from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Profile
from .serializers import *

import math

# Create your views here.

# game/pong/rank/
class RankAPIView(APIView):
    def get(self, request):
        try:
            game_type = request.GET.get('game_type', None)
            page = int(request.GET.get('page', 0))
            page_size = int(request.GET.get('page_size', 20))

            start_index = page_size * page
            end_index = page_size * (page + 1)

            all_users_with_profile = Profile.objects.all().select_related('user_id').order_by('-rating')
            serializer = CustomRankSerializer(all_users_with_profile[start_index:end_index], many=True)
            content_length = len(all_users_with_profile)
            response_data = {
                'page': page,
                'page_size': page_size,
                'last_page_index': math.ceil(content_length / page_size),
                'content_length': content_length,
                'data' : serializer.data,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        

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