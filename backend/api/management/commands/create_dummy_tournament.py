from django.core.management.base import BaseCommand
from api.models import Tournament

class Command(BaseCommand):
    help = 'Creates dummy Tournaments with game_type set to "pong_4"'

    def handle(self, *args, **options):
        # Create dummy Tournaments
        for i in range(1, 6):  # Adjust the range based on the number of dummy Tournaments you want
            Tournament.objects.create(game_type='pong_4')

        self.stdout.write(self.style.SUCCESS('Successfully created dummy Tournaments'))
