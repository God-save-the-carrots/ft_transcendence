from websockets.server import WebSocketServerProtocol
from types import SimpleNamespace
from engine.util import now
import json

class User:
    def __init__(self, socket: WebSocketServerProtocol, intra_id, game_type):
        self.socket = socket
        self.intra_id = intra_id
        self.game_type = game_type
        self.onclose = None
        self.onmessage = None
        self.connected_at = now()
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

    async def send(self, data):
        await self.socket.send(data)

    async def send_json(self, json_data):
        await self.socket.send(json.dumps(json_data))

    async def recv_json(self, json_data):
        if self.onmessage is not None:
            await self.onmessage(self, json_data)
