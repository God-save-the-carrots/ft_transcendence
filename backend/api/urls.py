from django.urls import path, include

from .views import LoginAPIView, LogoutAPIView, UserAPIView, ScoreAPIView, MatchesAPIView, RankAPIView

urlpatterns = [
    path('login', LoginAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('user/<str:intra_id>/', UserAPIView.as_view()),
    path('game/pong/rank/', RankAPIView.as_view()),
    path('game/pong/score/<str:intra_id>/', ScoreAPIView.as_view()),
    path('game/pong/matches/<int:match_id>/', MatchesAPIView.as_view()),
]
