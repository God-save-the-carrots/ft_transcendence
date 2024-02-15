from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import User, Profile
from .serializers import *

import requests
from django.conf import settings
from django.shortcuts import redirect
from urllib.parse import urlencode

# Create your views here.

# login
# oauth 후 작업필요.
class LoginAPIView(APIView):
    def get(self, request):
        client_id = settings.CLIENT_ID
        client_secret = settings.CLIENT_SECRET
        redirect_uri = settings.REDIRECT_URI

        login_serializer = LoginSerializer(data=request.query_params)
        if not login_serializer.is_valid():
            query_params = {
                'client_id': client_id,
                'redirect_uri': redirect_uri,
                'response_type': 'code',
            }
            return redirect(f"https://api.intra.42.fr/oauth/authorize?{urlencode(query_params)}")

        token = requests.post('https://api.intra.42.fr/oauth/token', data={
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
            'code': login_serializer.validated_data['code'],
        })
        if token.status_code != 200:
            return Response({"error": "Failed to get token"}, status=status.HTTP_400_BAD_REQUEST)

        token_serializer = TokenSerializer(data=token.json())
        if not token_serializer.is_valid():
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        me = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f"Bearer {token.json()['access_token']}"})
        if me.status_code != 200:
            return Response({"error": "Failed to get 42 info"}, status=status.HTTP_400_BAD_REQUEST)
        user_instance = User.objects.get_or_create(intra_id=me.json()['login'])

        # todo: return jwt token
        custom_user_serializer = CustomUserSerializer(user_instance[0])
        response_data = custom_user_serializer.data
        return Response(response_data, status=status.HTTP_200_OK)

# logout
# oauth 후 작업필요.
class LogoutAPIView(APIView):
    def post(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)

# user/<str:intra_id>/
class UserAPIView(APIView):
    def get(self, request, intra_id):
        try:
            user_model = User.objects.get(intra_id=intra_id)
            serializer = CustomUserSerializer(user_model)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, intra_id):
        try:
            profile_instance = Profile.objects.get(user_id__intra_id=intra_id)
        except Profile.DoesNotExist:
            return Response(serializer.data, status=status.HTTP_404_NOT_FOUND)

        if 'photo_id' in request.data:
            profile_instance.photo_id = request.data['photo_id']
        if 'message' in request.data:
            profile_instance.message = request.data['message']
        
        profile_instance.save()

        serializer = ProfileSerializer(profile_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)