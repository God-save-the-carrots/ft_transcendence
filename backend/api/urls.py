from django.urls import path, include

from .views import LoginAPIView, LogoutAPIView, UserAPIView, ScoreAPIView, MatchesAPIView

urlpatterns = [
    path('login', LoginAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('user/<str:intra_id>/', UserAPIView.as_view()),
    path('game/Pong/score/<str:intra_id>/', ScoreAPIView.as_view()),
    path('game/Pong/matches/<int:match_id>/', MatchesAPIView.as_view()),
]
