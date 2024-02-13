import uuid
import requests
import asyncio
from datetime import datetime, timezone

def now():
    return datetime.now(timezone.utc).timestamp()

def generate_random_id():
    return uuid.uuid4().hex

def post_request(endpoint, body):
    return requests.post(endpoint, data=body)

async def post_data(endpoint, body):
    try:
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(None, post_request, endpoint, body)
        if res.status_code == 200:
            return res.json()
        else:
            print("post_data error:", res.status_code, res.text)
            return None
    except requests.exceptions.RequestException as e:
        print("post_data except:", e)
        return None
