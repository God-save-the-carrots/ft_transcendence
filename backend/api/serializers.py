from django.apps import apps
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User, Profile, Tournament, GameSession, Pong

class LoginSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=100)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'

class GameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = '__all__'

class PongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pong
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    photo_id = serializers.IntegerField(source='profile.photo_id')
    message = serializers.CharField(source='profile.message')

    class Meta:
        model = User
        fields = ['id', 'intra_id', 'photo_id', 'message']


