from django.core.management.base import BaseCommand
from accounts.models import User
from pong.models import Tournament

class Command(BaseCommand):
    help = 'Deletes dummy'

    def handle(self, *args, **options):
        # Delete dummy users
        dummy_users = User.objects.filter(intra_id__startswith='dummy')
        dummy_users.delete()

        dummy_users = Tournament.objects.filter(game_type='pong_4')
        dummy_users.delete()

        self.stdout.write(self.style.SUCCESS('Successfully deleted dummy'))
