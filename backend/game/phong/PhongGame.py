from game.Game import Game
from game.GameObject import GameObject, Vector2, Line
from game.phong import logic, map as phong_map
from game.User import User
import json
import math

class PhongGame(Game):
    def __init__(self, players: 'list[User]'):
        Game.__init__(self, players, "phong_" + str(len(players)))
        self.players: list[User] = players
        self.onfinish = None

        self.object_list = phong_map.select_map(len(players))
        self.object_wall = self.filter_object(lambda x: x.tag == "wall")
        self.player_objs = self.filter_object(lambda x: x.tag == "player")
        self.ball_objs = self.filter_object(lambda x: x.tag == "ball")
        self.dynamic_objs = self.filter_object(lambda x: x.tag == "player" or x.tag == "ball")
        self.rect_objs = self.filter_object(lambda x: x.type == "rect")
        self.object_dict: dict[str, GameObject] = {}
        for obj in self.object_list:
            self.object_dict[obj.id] = obj

        i = 0
        for user in players:
            user.push_onclose_event(self.onclose)
            user.push_onmessage_event(self.onmessage)
            user.data.unit_id = self.player_objs[i].id
            user.data.move = 0
            i += 1

        self.player_speed = 20
        self.min_ball_speed = 10
        self.max_ball_speed = 25
        self.last_touch_player = None
        
        i = 0
        for ball in self.ball_objs:
            rad = math.pi / 180 * i
            ball.set_acc(position=Vector2(math.cos(rad), math.sin(rad))*self.min_ball_speed)
            i += 1

    async def start_first_frame(self):
        objects = list(map(lambda x: x.json(), self.object_list))
        players = []
        for user in self.players:
            players.append({"intra_id": user.intra_id,"unit_id": user.data.unit_id})
        send_data = json.dumps({"type": "init", "objects": objects, "players": players})
        for user in self.players:
            await user.send(send_data)

    async def update(self, frame, delta):
        self.move_player(delta)
        collided_objs = self.move_ball(delta)
        debug = {}
        if len(collided_objs) != 0:
            debug["detected_wall_id"] = collided_objs[0].id

        changed = [(obj, obj.get_changed_acc_json()) for obj in self.dynamic_objs]
        changed = filter(lambda x: x[1] is not None, changed)
        changed = map(lambda x: {"id":x[0].id,"to":x[0].transform.json(),"acc":x[1]}, changed)
        changed = list(changed)

        if len(changed) != 0:
            await self.broadcast({
                "type": "update",
                "changed": changed,
                "debug": debug,
            })

        if len(self.players) == 0:
            return False
        return True

    async def finish(self):
        if self.onfinish is not None:
            await self.onfinish(self, self.players)

        for player in self.players:
            player.pop_onclose_event()
            player.pop_onmessage_event()

        return {
            "grade": self.players
        }

    async def onmessage(self, user, json_data):
        if json_data["type"] == "move":
            user.data.move = json_data["data"]["move"] # 0, 1, -1
            unit = self.object_dict[user.data.unit_id]
            if user.data.move == 0:
                unit.set_acc(position=Vector2(0, 0))
            elif user.data.move == 1:
                unit = self.object_dict[user.data.unit_id]
                left = Vector2(-unit.transform.rotation.y, unit.transform.rotation.x)
                unit.set_acc(position=left*self.player_speed)
            elif user.data.move == -1:
                unit = self.object_dict[user.data.unit_id]
                right = Vector2(unit.transform.rotation.y, -unit.transform.rotation.x)
                unit.set_acc(position=right*self.player_speed)

    async def onclose(self, user):
        self.players.remove(user)
        print("close", user)

    def filter_object(self, test_func) -> 'list[GameObject]':
        return list(filter(test_func, self.object_list))

    def move_player(self, delta):
        for player in self.player_objs:
            player.apply_acc(delta)

    def move_ball(self, delta):
        collided_objs = []
        ball = self.ball_objs[0]
        old_position, old_rotation, old_scale = ball.apply_acc(delta)
        for rect in self.rect_objs:
            current_position = ball.transform.position
            ray = Line(old_position, current_position)
            point = logic.pass_through(ray, rect)
            if point is None:
                continue
            if ball.acc.position.dot(rect.transform.rotation) > 0:
                continue
            if rect.tag == "player":
                self.min_ball_speed = min(self.min_ball_speed + 1, self.max_ball_speed)
                self.last_touch_player = self.get_owner(rect)
            new_acc_pos = logic.reflect(ball, rect, self.min_ball_speed)
            ball.set_acc(position=new_acc_pos)
            ball.transform.position = point + new_acc_pos * 0.0001
            collided_objs.append(rect)
        return collided_objs

    def get_owner(self, rect):
        func = lambda x: x.data.unit_id == rect.id
        owner = next(player for player in self.players if func(player))
        return owner
