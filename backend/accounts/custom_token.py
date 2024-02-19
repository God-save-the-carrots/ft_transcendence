# custom_token.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

def get_tokens_for_user(user):

    refresh = TokenObtainPairSerializer.get_token(user)
    refresh['intra_id'] = user.intra_id

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# 만료.
# 판별.