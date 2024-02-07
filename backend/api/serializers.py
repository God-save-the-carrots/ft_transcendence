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

class CustomRankSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(source='user_id', read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'rating']

# =================================================================

class CustomPongSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(source='user_id')
    value = serializers.SerializerMethodField()

    def get_value(self, instance):
        if instance.rank == 1:
            return 100
        elif instance.rank == 2:
            return -60
        elif instance.rank == 3:
            return -40
        elif instance.rank == 4:
            return -20
        else:
            return 0

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
        return CustomPongSerializer(pongs, many=True).data
    
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
    
# ========================================================================================

class CustomMatchGameSessionSerializer(serializers.ModelSerializer):
    round = CustomPongSerializer(source='pong_set', many=True)

    class Meta:
        model = GameSession
        fields = ['match_type', 'round']

class CustomMatchesSerializer(serializers.ModelSerializer):
    match_id = serializers.IntegerField(source='id')
    game = CustomMatchGameSessionSerializer(source='gamesession_set', many=True)

    class Meta:
        model = Tournament
        fields = ['match_id', 'game_type', 'game']