from django.contrib import admin

from .models import Pong, GameSession, Tournament

# Register your models here.

admin.site.register(Tournament)
admin.site.register(GameSession)
admin.site.register(Pong)