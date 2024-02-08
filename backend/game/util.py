import uuid
from datetime import datetime, timezone

def now():
    return datetime.now(timezone.utc).timestamp()

def generate_random_id():
    return uuid.uuid4().hex
