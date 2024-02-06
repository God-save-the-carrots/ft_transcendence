import asyncio
from game.User import User
from game.Game import Game

class VirtualException(BaseException):
    def __init__(self):
        BaseException(self)

class Rule:
    async def start(self):
        raise VirtualException()

    async def step(self, level, timer):
        print(level) # for debug
        await self.broadcast(self.players, {"type": "step", "level": level, "timer": timer})
        await asyncio.sleep(timer)

    async def broadcast(self, players, json_data):
        for player in players:
            await player.send_json(json_data)

    async def disconnect(self, players):
        for player in players:
            try:
                await player.socket.close()
            except:
                pass
