from django.core.management.base import BaseCommand
from api.models import User

class Command(BaseCommand):
    help = 'Deletes dummy users with intra_id starting with "dummy"'

    def handle(self, *args, **options):
        # Delete dummy users
        dummy_users = User.objects.filter(intra_id__startswith='dummy')
        dummy_users.delete()

        self.stdout.write(self.style.SUCCESS('Successfully deleted dummy users'))
