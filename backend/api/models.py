# models.py

from django.contrib.auth.models import User
from django.db import models

# Create your models here.

# User : 유저의 정보 (바뀌지않는 정보)
class User(models.Model):
    user_id = models.IntegerField(primary_key=True)
    intra_id = models.CharField(max_length=30)

# profile : User와 1대1로 매칭이되는 정보 (변하는 정보)
class Profile(models.Model):
    profile_id = models.IntegerField(primary_key=True)
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    photo_type = models.IntegerField(default=0)
    rating = models.IntegerField(default=1024)
    message = models.CharField(max_length=30, blank=True, null=True)

# GameSession : 
# game_type : phong_4, phong_3
# start_time : 매 판마다의 게임시작 시간.
# end_time : 매 판마다의 게임끝난 시간.
class GameSession(models.Model):
    game_type = models.CharField()
    start_time = models.TimeField() 
    end_time = models.TimeField()

# Phong : 매 판마다 생성이되는 각 게임의 정보
# 
class Phong(models.Model):
    phong_id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(User)
    game_session_id = models.ForeignKey(GameSession)
    is_win = models.
    ball_touch = models.IntegerField()
    score = models.IntegerField()
