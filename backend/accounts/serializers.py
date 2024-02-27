from django.apps import apps
from rest_framework import serializers

from .models import User, Profile

class LoginSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=100)

class TokenSerializer(serializers.Serializer):
    access_token = serializers.CharField(max_length=100)
    token_type = serializers.CharField(max_length=100)
    expires_in = serializers.IntegerField()
    refresh_token = serializers.CharField(max_length=100)
    created_at = serializers.IntegerField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    photo_id = serializers.IntegerField(source='profile.photo_id')
    message = serializers.CharField(source='profile.message')
    rating = serializers.IntegerField(source='profile.rating')

    class Meta:
        model = User
        fields = ['id', 'intra_id', 'photo_id', 'message', 'rating']
