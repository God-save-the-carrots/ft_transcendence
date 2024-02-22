from django.urls import path, include

from .views import *
# from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', include('accounts.urls')),
    path('game/pong/', include('pong.urls')),
    path('token/access-granted/', AccessGrantedView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    # path('token/validate/', TokenValidationView.as_view()),
    # path("auth/access-refreshed/", AccessRefreshedView.as_view())
]
