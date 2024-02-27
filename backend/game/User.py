from websockets.server import WebSocketServerProtocol
from types import SimpleNamespace
from typing import Coroutine
from game.util import now
import json

class User:
    def __init__(self, socket: WebSocketServerProtocol, intra_id, game_type, alias, photo_id):
        self.socket = socket
        self.intra_id = intra_id
        self.photo_id = photo_id
        self.game_type = game_type
        self.onclose: 'list[Coroutine]' = []
        self.onmessage: 'list[Coroutine]' = []
        self.connected = True
        self.connected_at = now()
        self.alias = alias
        self.data = SimpleNamespace()

    @property
    def age(self):
        current = now()
        return current - self.connected_at

    @property
    def opened(self):
        return self.socket.open
    
    @property
    def closed(self):
        return self.socket.closed

    def push_onclose_event(self, cor: Coroutine):
        self.onclose.append(cor)
    
    def pop_onclose_event(self):
        return self.onclose.pop()
    
    def push_onmessage_event(self, cor: Coroutine):
        self.onmessage.append(cor)

    def pop_onmessage_event(self):
        return self.onmessage.pop()

    async def send(self, data):
        try:
            await self.socket.send(data)
            self.connected = True
        except:
            self.connected = False

    async def send_json(self, json_data):
        await self.send(json.dumps(json_data))

    async def recv_json(self, json_data):
        for event in reversed(self.onmessage):
            await event(self, json_data)

    async def loop(self):
        async for message in self.socket:
            try:
                await self.recv_json(json.loads(message))
            except Exception as e:
                print(self.socket.id, "error:", e)
                break
        for event in reversed(self.onclose):
            await event(self)
        print(self.socket.id, "close")

    async def close(self):
        self.connected = False
        await self.socket.close()

    def is_open(self):
        return self.socket.closed == False
