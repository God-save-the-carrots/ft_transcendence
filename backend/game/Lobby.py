import asyncio
from game.User import User
from game.NormalGame import NormalGame
from game.Tournament import Tournament

from game.pong.PongGame import PongGame
from websockets.exceptions import ConnectionClosedOK

class Lobby:
    def __init__(self):
        self.qlist: dict[str, list[User]] = {
            "pong": [],
            "pong_4": [],
        }
        self.qmatch = {
            "pong": {"cap":(2, 3), "rule":NormalGame, "game":PongGame} ,
            "pong_4": {"cap":(4, 4), "rule":Tournament, "game":PongGame},
        }

    def join_lobby(self, user: User):
        q = self.qlist[user.game_type]
        if q == None:
            raise "err"
        q.append(user)
        user.push_onclose_event(self.leave_lobby)
        user.push_onmessage_event(self.request_leave_lobby)
        print(user.socket.id, "join", user.game_type)

    def is_valid_game_type(self, game_type):
        return self.qlist.get(game_type) != None

    async def leave_lobby(self, user: User):
        q = self.qlist.get(user.game_type)
        if q == None or user not in q:
            return
        q.remove(user)

    async def request_leave_lobby(self, user: User, json_data):
        q = self.qlist.get(user.game_type)
        if q == None:
            return
        else:
            if user in q:
                q.remove(user)
            await user.send_json({"type":"close","status":"success"})
            await user.socket.close()
            print(user.socket.id, "leave lobby")

    async def match(self):
        for game_type in self.qmatch:
            cap = self.qmatch.get(game_type).get("cap")
            users = self.qlist.get(game_type)
            user_cnt = len(users)
            if user_cnt == 0 or user_cnt < cap[0] or users[0].age < 4:
                continue
            player_cnt = min(cap[1], user_cnt)
            players: list[User] = users[0:player_cnt]
            for player in players:
                users.remove(player)
            asyncio.create_task(self.game_ready(players, game_type))

    async def game_ready(self, players: 'list[User]', game_type):
        timer = 5
        for player in players:
            try:
                await player.send_json({"type":"ready","timer":timer})
            except ConnectionClosedOK:
                pass
        await asyncio.sleep(timer)
        if all(player.opened for player in players):
            rule_constructor = self.qmatch.get(game_type).get("rule")
            game_constructor = self.qmatch.get(game_type).get("game")
            for player in players:
                try:
                    await player.send_json({"type":"match","status":"success"})
                    player.pop_onclose_event()
                    player.pop_onmessage_event()
                except:
                    pass
            session = rule_constructor(players, game_constructor)
            asyncio.create_task(session.start())
            print("matched:", game_type)
        else:
            users = self.qlist.get(game_type)
            for player in players:
                if player.opened:
                    await player.send_json({"type":"match","status":"fail"})
                    users.insert(0, player)
