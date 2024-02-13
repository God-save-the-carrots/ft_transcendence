"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_application = get_asgi_application()

async def websocket_application(scope, receive, send):
    while True:
        event = await receive()
        print("- websocket", event)
        if event['type'] == 'websocket.connect':
            print("- connect")
            await send({'type': 'websocket.accept'})
        if event['type'] == 'websocket.receive':
            print("- receive")
            # await send({'type': 'websocket.send', 'text': event['text']})
        if event['type'] == 'websocket.disconnect':
            print("- disconnect")
            break
        print("---")

async def application(scope, receive, send):
    print("scope", scope)
    if scope['type'] == 'websocket':
        await websocket_application(scope, receive, send)
    else:
        await django_application(scope, receive, send)
