from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework import status

def validate_token(token, token_type='access'):
    try:
        if token_type == 'access':
            AccessToken(str(token)).verify()
        elif token_type == 'refresh':
            RefreshToken(str(token)).verify()
        return True
    except Exception:
        return False

class TokenRefreshAPIView(APIView):

    def post(self, request):
        refresh_token_str = request.data.get('refresh')
        access_token_str = request.data.get('access')

        if not refresh_token_str or not access_token_str:
            return Response({"error": "Both refresh and access are required"}, status=status.HTTP_400_BAD_REQUEST)

        refresh_token_result = validate_token(refresh_token_str, 'refresh')
        access_token_result = validate_token(access_token_str, 'access')
        
        if not refresh_token_result and not access_token_result:
            return Response({"error": "not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
    
        elif not access_token_result and refresh_token_result:
            try:
                refresh_token = RefreshToken(refresh_token_str)
                new_access_token = refresh_token.access_token
                return Response({'access': str(new_access_token)}, status=status.HTTP_201_CREATED) 
            except Exception:
                return Response({"error": "not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"message": "Access granted"}, status=status.HTTP_200_OK)