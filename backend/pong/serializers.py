from django.apps import apps
from rest_framework import serializers
from .models import Pong, GameSession, Tournament
from accounts.models import Profile

from accounts.serializers import CustomUserSerializer

def get_custom_value(instance):
    if instance.rank == 1:
        return 100
    elif instance.rank == 2:
        return -20
    elif instance.rank == 3:
        return -40
    elif instance.rank == 4:
        return -60
    else:
        return 0

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

class CustomRankSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(source='user_id', read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'rating']

class CustomMatchPongSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(source='user_id')
    rating = serializers.IntegerField(source='user_id.profile.rating')
    value = serializers.SerializerMethodField()

    def get_value(self, instance):
        return get_custom_value(instance)

    class Meta:
        model = Pong
        fields = ['user', 'rating', 'value', 'rank', 'score']

class CustomMatchGameSessionSerializer(serializers.ModelSerializer):
    round = CustomMatchPongSerializer(source='pong_set', many=True)
    second = serializers.SerializerMethodField()

    def get_second(self, instance):
        second = (instance.end_time - instance.start_time).total_seconds()
        return int(second)

    class Meta:
        model = GameSession
        fields = ['match_type', 'second', 'round']

class CustomMatchesSerializer(serializers.ModelSerializer):
    match_id = serializers.IntegerField(source='id')
    game = CustomMatchGameSessionSerializer(source='gamesession_set', many=True)

    class Meta:
        model = Tournament
        fields = ['match_id', 'game_type', 'game']

