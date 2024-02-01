from game.Game import Game
from game.GameObject import GameObject, Vector2, Line
from game.phong import logic, map as phong_map
from game.User import User
import json
import math

class PhongGame(Game):
    def __init__(self, users: 'list[User]'):
        Game.__init__(self, users, "phong_" + str(len(users)))
        self.users: list[User] = users

        self.object_list = phong_map.select_map(len(users))
        self.object_wall: list[GameObject] = list(
            filter(lambda x: x.tag == "wall", self.object_list)
        )
        self.player_objs: list[GameObject] = list(
            filter(lambda x: x.tag == "player", self.object_list)
        )
        self.ball_objs: list[GameObject] = list(
            filter(lambda x: x.tag == "ball", self.object_list)
        )
        self.dynamic_objs: list[GameObject] = list(
            filter(lambda x: x.tag == "player" or x.tag == "ball", self.object_list)
        )
        self.rect_objs: list[GameObject] = list(
            filter(lambda x: x.type == "rect", self.object_list)
        )
        self.object_dict: dict[str, GameObject] = {}
        for obj in self.object_list:
            self.object_dict[obj.id] = obj

        i = 0
        for user in users:
            user.push_onclose_event(self.onclose)
            user.push_onmessage_event(self.onmessage)
            user.data.unit_id = self.player_objs[i].id
            user.data.move = 0
            i += 1

        self.player_speed = 20
        self.min_ball_speed = 10
        self.max_ball_speed = 25
        
        i = 0
        for ball in self.ball_objs:
            rad = math.pi / 180 * i
            ball.set_acc(position=Vector2(math.cos(rad), math.sin(rad))*self.min_ball_speed)
            i += 1

    async def start_first_frame(self):
        objects = list(map(lambda x: x.json(), self.object_list))
        players = []
        for user in self.users:
            players.append({"intra_id": user.intra_id,"unit_id": user.data.unit_id})
        send_data = json.dumps({"type": "init", "objects": objects, "players": players})
        for user in self.users:
            await user.send(send_data)

    async def update(self, frame, delta):
        test_detected_wall = None
        for player in self.player_objs:
            player.apply_acc(delta)

        for ball in self.ball_objs:
            old_position, old_rotation, old_scale = ball.apply_acc(delta)
            for rect in self.rect_objs:
                current_position = ball.transform.position
                ray = Line(old_position, current_position)
                point = logic.pass_through(ray, rect)
                if point is not None:
                    if ball.acc.position.dot(rect.transform.rotation) > 0:
                        continue
                    new_acc = logic.reflect(ball, rect, self.min_ball_speed)
                    ball.set_acc(position=new_acc)
                    ball.transform.position = point + new_acc * 0.0001
                    self.min_ball_speed = min(self.min_ball_speed + 1, self.max_ball_speed)
                    if rect.tag == "wall":
                        test_detected_wall = rect

        changed = []
        for obj in self.dynamic_objs:
            acc_json = obj.get_changed_acc_json()
            if acc_json is None:
                continue
            changed.append({
                "id":obj.id,
                "to": obj.transform.json(),
                "acc": acc_json,
            })

        if len(changed) != 0:
            send_data = {
                "type": "update",
                "changed": changed,
                "debug": {}
            }
            if test_detected_wall is not None:
                send_data["debug"]["detected_wall_id"] = test_detected_wall.id
            await self.broadcast(send_data)

        if len(self.users) == 0:
            return False
        return True
    
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
        self.users.remove(user)
        print("close", user)
