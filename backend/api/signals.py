# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile, Tournament, GameSession, Pong


@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user_id=instance)


@receiver(post_save, sender=Tournament)
def create_GameSessions(sender, instance, created, **kwargs):
    if created:
        for _ in range(3):
            GameSession.objects.create(tournament_id=instance)


@receiver(post_save, sender=GameSession)
def create_pongs(sender, instance, created, **kwargs):
    if created:
        for _ in range(2):
            Pong.objects.create(game_session_id=instance)
