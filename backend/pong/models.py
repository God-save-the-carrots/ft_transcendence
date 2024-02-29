from django.db import models
from django.utils import timezone

from accounts.models import User

# Create your models here.

# Tournament :
class Tournament(models.Model):
    PONG_4 = 'pong_4'

    GAME_TYPE_CHOICES = [
        (PONG_4, 'pong 4'),
    ]

    # Tournament의 type이 생길 수 있으니 일단 보류.
    game_type = models.CharField(max_length=10, choices=GAME_TYPE_CHOICES)

# GameSession : 매 판마다 생성이되는 게임의 종류 및 정보
class GameSession(models.Model):
    ROUND_1 = 'round_1'
    ROUND_2 = 'round_2'
    
    MATCH_TYPE_CHOICES = [
        (ROUND_1, 'round 1'),
        (ROUND_2, 'round 2'),
    ]

    tournament_id = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    match_type = models.CharField(max_length=10, choices=MATCH_TYPE_CHOICES, blank=True)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(default=timezone.now)

    def is_valid_session(self):
        return self.start_time <= self.end_time


# Pong : GameSession에 따라 유저마다 생성이될 각 게임정보.
class Pong(models.Model):
    game_session_id = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    rank = models.IntegerField(default=0)
    score = models.IntegerField(default=0)