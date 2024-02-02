from django.core.management.base import BaseCommand
from api.models import Tournament

class Command(BaseCommand):
    help = 'Deletes dummy Tournaments with game_type starting with "pong_4"'

    def handle(self, *args, **options):
        # Delete dummy users
        dummy_users = Tournament.objects.filter(game_type='pong_4')
        dummy_users.delete()

        self.stdout.write(self.style.SUCCESS('Successfully deleted dummy Tournaments'))
