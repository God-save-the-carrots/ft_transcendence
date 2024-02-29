import math
import json
import uuid

class Vector2:
    def __init__(self, x=0, y=0):
        self.x = float(x)
        self.y = float(y)

    def __eq__(self, rhs) -> bool:
        return self.x == rhs.x and self.y == rhs.y
    
    def __neg__(self) -> 'Vector2':
        return Vector2(-self.x, -self.y)
    
    def __add__(self, rhs) -> 'Vector2':
        return Vector2(self.x + rhs.x, self.y + rhs.y)

    def __sub__(self, rhs) -> 'Vector2':
        return Vector2(self.x - rhs.x, self.y - rhs.y)

    def __mul__(self, rhs: float) -> 'Vector2':
        return Vector2(self.x * rhs, self.y * rhs)

    def __truediv__(self, rhs: float) -> 'Vector2':
        return Vector2(self.x / rhs, self.y / rhs)

    def __str__(self) -> str:
        return json.dumps(self.json())
    
    def sqrt_length(self) -> float:
        return self.x * self.x + self.y * self.y
    
    def normalized(self) -> 'Vector2':
        length = self.length()
        if length == 0:
            return Vector2(0, 0)
        return self / length

    def length(self) -> float:
        return math.sqrt(self.sqrt_length())
    
    def distance(self, other:'Vector2') -> float:
        x = other.x - self.x
        y = other.y - self.y
        return math.sqrt(x * x + y * y)

    def dot(self, other:'Vector2') -> float:
        return self.x * other.x + self.y * other.y

    def json(self):
        return {"x": self.x, "y": self.y}

class Line:
    def __init__(self, start:Vector2, end:Vector2):
        self.start = start
        self.end = end
        self.center = (start + end) * 0.5

    def __str__(self):
        return f"{self.start} -> {self.end}"

    def closest_point(self, point:Vector2):
        u = point - self.start
        v = self.end - self.start
        vv = v.dot(v)
        if vv == 0:
            return None
        uv = u.dot(v)
        p = self.start + v * (uv / vv)
        if uv < 0:
            return self.start
        if self.start.distance(p) > self.start.distance(self.end):
            return self.end
        return p

class Ray2:
    def __init__(self, origin:Vector2, direction:Vector2, t:float = 999999):
        self.origin = origin
        self.direction = direction
        self.t = Vector2()

class Transform:
    def __init__(self):
        self.position = Vector2()
        self.rotation = Vector2()
        self.scale = Vector2()

    def __str__(self):
        return json.dumps(self.json())

    def json(self):
        return {
            "position": self.position.json(),
            "rotation": self.rotation.json(),
            "scale": self.scale.json(),
        }

class GameObject:
    def __init__(self, tag, _type):
        self.id = str(uuid.uuid4()).split("-").pop(0)
        self.tag = str(tag)
        self.type = str(_type)
        self.transform = Transform()
        self.acc = Transform()
        self._dirty_acc_position = False
        self._dirty_acc_rotation = False
        self._dirty_acc_scale = False

    def __str__(self):
        return f"<GameObject {self.id} {self.type}>"

    def apply_acc(self, delta) -> Vector2:
        old_position = self.transform.position
        old_rotation = self.transform.rotation
        old_scale = self.transform.scale
        self.transform.position = self.transform.position + (self.acc.position * delta)
        self.transform.rotation = self.transform.rotation + (self.acc.rotation * delta)
        self.transform.scale = self.transform.scale + (self.acc.scale * delta)
        return old_position, old_rotation, old_scale

    def set_acc(self, position:Vector2=None, rotation:Vector2=None, scale:Vector2=None):
        if position is not None:
            self.acc.position = position
            self._dirty_acc_position = True
        if rotation is not None:
            self.acc.rotation = rotation
            self._dirty_acc_rotation = True
        if scale is not None:
            self.acc.scale = scale
            self._dirty_acc_scale = True

    def get_changed_acc_json(self):
        res = {}
        if self._dirty_acc_position:
            self._dirty_acc_position = False
            res["position"] = self.acc.position.json()
        if self._dirty_acc_rotation:
            self._dirty_acc_rotation = False
            res["rotation"] = self.acc.rotation.json()
        if self._dirty_acc_scale:
            self._dirty_acc_scale = False
            res["scale"] = self.acc.scale.json()
        if len(res) == 0:
            return None
        return res

    def json_str(self):
        return json.dumps(self.json())

    def json(self):
        return {
            "id": self.id,
            "tag": self.tag,
            "type": self.type,
            "transform": self.transform.json(),
            "acc": self.acc.json()
        }
