import json
import asyncio
from game import util
from game.User import User

class VirtualException(BaseException):
    def __init__(self):
        BaseException(self)

class Game:
    def __init__(self, users, name):
        self.frame = 0
        self.users: list[User] = users
        self.game_type = name
        self.target_frame = 60

    async def loop(self):
        delta_time = 1.0 / self.target_frame
        self.frame = 0
        start = util.now()
        await self.start()
        while True:
            delta = util.now() - start
            start = util.now()
            if await self.update(self.frame,  delta) == False:
                break
            update_time = util.now() - start
            next_sleep = max(0, delta_time - update_time)
            await asyncio.sleep(next_sleep)
            self.frame = self.frame + 1

    async def start(self):
        raise VirtualException()

    async def update(self, frame, delta):
        raise VirtualException()
    
    async def onmessage(self, user, json_data):
        pass

    async def onclose(self, user):
        pass

    async def broadcast(self, json_data):
        data = json.dumps(json_data)
        for user in self.users:
            try:
                await user.send(data)
            except:
                print("broadcast x", user.intra_id)
                pass
