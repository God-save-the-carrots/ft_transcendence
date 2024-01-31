from django.apps import apps
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User, Profile

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
