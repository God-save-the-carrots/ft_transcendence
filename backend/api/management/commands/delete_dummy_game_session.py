from django.core.management.base import BaseCommand
from api.models import GameSession

class Command(BaseCommand):
    help = 'Deletes all GameSessions'

    def handle(self, *args, **options):
        # Delete dummy users
        dummy_users = GameSession.objects.all()
        dummy_users.delete()

        self.stdout.write(self.style.SUCCESS('Successfully deleted all GameSessions'))
