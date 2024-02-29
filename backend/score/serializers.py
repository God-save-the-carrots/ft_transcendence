from django.apps import apps
from rest_framework import serializers

from accounts.models import User
from pong.models import Pong, GameSession, Tournament

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

class CustomScorePongSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(source='user_id')
    value = serializers.SerializerMethodField()

    def get_value(self, instance):
        return get_custom_value(instance)

    class Meta:
        model = Pong
        fields = ['user', 'value', 'rank']

class CustomScoreGameSessionSerializer(serializers.ModelSerializer):
    pong = serializers.SerializerMethodField()

    def get_pong(self, instance):
        if instance.match_type == 'round_2':
            pongs = instance.pong_set.all()
        elif instance.match_type == 'round_1':
            pongs = [max(instance.pong_set.all(), key=lambda x: x.rank)]
        return CustomScorePongSerializer(pongs, many=True).data
    
    class Meta:
        model = GameSession
        fields = ['pong']

class CustomScoreSerializer(serializers.ModelSerializer):
    match_id = serializers.IntegerField(source='id')
    score = serializers.SerializerMethodField()

    class Meta: 
        model = Tournament
        fields = ['match_id', 'score']

    def get_score(self, instance):
        all_matches = []
        for match in instance.gamesession_set.all():
            match_data = CustomScoreGameSessionSerializer(match).data
            all_matches.extend(match_data['pong'])
        return all_matches

class CustomWinningPercentageSerializer(serializers.ModelSerializer):
    winning_percentage = serializers.SerializerMethodField()

    def get_winning_percentage(self, instance):
        user_instance = User.objects.get(intra_id=instance.intra_id)
        user_pongs = Pong.objects.filter(user_id=user_instance).distinct('game_session_id__tournament_id')
        total_game = user_pongs.count()
        winning_game = user_pongs.filter(rank=1).count()
        winning_percentage = (winning_game / total_game) * 100 if total_game > 0 else 0
        return int(winning_percentage)

    class Meta:
        model = User
        fields = ['intra_id', 'winning_percentage']
