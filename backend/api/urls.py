from django.urls import path, include

from .views import *

urlpatterns = [
    path('game/pong/', include('pong.urls')),
    path('', include('accounts.urls')),
]
