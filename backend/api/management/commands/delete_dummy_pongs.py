from django.core.management.base import BaseCommand
from api.models import Pong

class Command(BaseCommand):
    help = 'Deletes all pongs'

    def handle(self, *args, **options):
        # Delete dummy users
        dummy_users = Pong.objects.all()
        dummy_users.delete()

        self.stdout.write(self.style.SUCCESS('Successfully deleted all Pongs'))
