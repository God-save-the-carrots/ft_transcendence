from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework import status

from accounts.models import User, UserRefreshToken, Profile

def validate_token(token, token_type='access'):
    try:
        if token_type == 'access':
            AccessToken(str(token)).verify()
        elif token_type == 'refresh':
            RefreshToken(str(token)).verify()
        return True
    except Exception:
        return False

class TokenVerifyAPIView(APIView):

    def post(self, request):
        refresh_token_str = request.data.get('refresh')
        access_token_str = request.data.get('access')

        if not refresh_token_str or not access_token_str:
            return Response({"error": "Both refresh and access are required"}, status=status.HTTP_400_BAD_REQUEST)

        refresh_token_result = validate_token(refresh_token_str, 'refresh')
        access_token_result = validate_token(access_token_str, 'access')
        
        if not refresh_token_result and not access_token_result:
            return Response({"error": "not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
    
        elif access_token_result and not refresh_token_result:
            return Response({"error": "not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                refresh_token = RefreshToken(refresh_token_str)
                intra_id = refresh_token.payload.get('intra_id')
                if intra_id is None:
                    return Response({"error": "Invalid refresh_token"}, status=status.HTTP_401_UNAUTHORIZED)
                
                user_instance_model = User.objects.get(intra_id=intra_id)
                new_refresh_token_model = UserRefreshToken.objects.get(user_id=user_instance_model.id)

                if str(refresh_token) != new_refresh_token_model.refresh_token:
                    return Response({"error": "Mismatched refresh tokens"}, status=status.HTTP_401_UNAUTHORIZED)

                new_refresh_token = TokenObtainPairSerializer.get_token(user_instance_model)
                new_refresh_token['intra_id'] = user_instance_model.intra_id
                new_access_token = new_refresh_token.access_token

                new_refresh_token_model.refresh_token = str(new_refresh_token)
                new_refresh_token_model.save()

                response = {
                    "intra_id": user_instance_model.intra_id,
                    "access": str(new_access_token),
                    "refresh": str(new_refresh_token)
                }
                return Response(response, status=status.HTTP_201_CREATED) 
            except User.DoesNotExist or UserRefreshToken.DoesNotExist:
                return Response({"error": "Invalid refresh_token"}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception:
                return Response({"error": "not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
