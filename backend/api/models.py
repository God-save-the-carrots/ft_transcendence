# models.py

from django.contrib.auth.models import User
from django.db import models

# Create your models here.

# User : 유저의 정보 (바뀌지않는 정보)
class User(models.Model):
    intra_id = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.intra_id} ({self.pk})"
    
    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)

        if not hasattr(self, 'profile'):
            Profile.objects.create(user_id=self)

# profile : User와 1대1로 매칭이되는 정보 (변하는 정보)
class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    photo_type = models.IntegerField(default=0)
    rating = models.IntegerField(default=1024)
    message = models.CharField(max_length=30, blank=True, null=True)

# # GameSession : 매 판마다 생성이되는 게임의 종류 및 정보
# class GameSession(models.Model):
#     game_type = models.CharField()
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField()

# # Phong : GameSession에 따라 유저마다 생성이될 각 게임정보.
# class Phong(models.Model):
#     user_id = models.ForeignKey(User)
#     game_session_id = models.ForeignKey(GameSession)
#     is_win = models.BooleanField(default=False)
#     ball_touch = models.IntegerField(default=0)
