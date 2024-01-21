from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=100)
