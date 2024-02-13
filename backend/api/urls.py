from django.urls import path

from .views import *

urlpatterns = [
    path('login', LoginAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('user/<str:intra_id>/', UserAPIView.as_view()),
    path('game/pong/rank/', RankAPIView.as_view()),
    path('game/pong/score/<str:intra_id>/', ScoreAPIView.as_view()),
    path('game/pong/matches/<int:match_id>/', MatchesAPIView.as_view()),
    path('game/pong/score/<str:intra_id>/profile/', ScoreProfileAPIView.as_view()),
    path('game/pong/score/<str:intra_id>/play-time/', ScorePlayTimeAPIView.as_view()),
    path('game/pong/score/<str:intra_id>/winning-rate', ScoreWinningRateAPIView.as_view()),
    path('game/pong/score/<str:intra_id>/goals-against-average', ScoreGoalsAgainstAverageAPIView.as_view()),
    path('game/pong/score/<str:intra_id>/winning-percentage', ScoreWinningPercentageAPIView.as_view()),
]
