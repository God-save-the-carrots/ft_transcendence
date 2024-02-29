from django.urls import path
from .views import *

urlpatterns = [
    path('<str:intra_id>/', ScoreAPIView.as_view()),
    path('<str:intra_id>/profile/', ScoreProfileAPIView.as_view()),
    path('<str:intra_id>/play-time/', ScorePlayTimeAPIView.as_view()),
    path('<str:intra_id>/winning-rate/', ScoreWinningRateAPIView.as_view()),
    path('<str:intra_id>/goals-against-average/', ScoreGoalsAgainstAverageAPIView.as_view()),
    path('<str:intra_id>/winning-percentage/', ScoreWinningPercentageAPIView.as_view()),
]