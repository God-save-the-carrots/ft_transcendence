#!/usr/bin/env python

import json
import asyncio
from websockets.server import serve, WebSocketServerProtocol
from game.Lobby import Lobby
from game.User import User

lobby = Lobby()
users: 'list[User]' = []

async def accept(websocket: WebSocketServerProtocol):
    global lobby
    global users
    print(websocket.id, "accept:", websocket.request_headers.get("Origin"), websocket.path)
    try:
        intra_id, game_type, alias = await auth(websocket)
        user = User(websocket, intra_id, game_type, alias)
        for in_user in users:
            if in_user.intra_id != user.intra_id:
                continue
            await user.close()
            raise "err"
        users.append(user)
        lobby.join_lobby(user)
    except asyncio.exceptions.CancelledError:
        print(websocket.id, "timeout")
        return
    except:
        print(websocket.id, "invalid")
        return
    await user.loop()

async def auth(websocket):
    raw_info = await asyncio.wait_for(websocket.recv(), timeout=10)
    info = json.loads(raw_info)
    token, game_type, alias = (info.get("token"), info.get("game"), info.get("data").get("alias"))
    if token == None:
        raise "err"
    if game_type == None or lobby.is_valid_game_type(game_type) == False:
        raise "err"
    print(websocket.id, "token:", token) # TODO: jwt validate check
    await websocket.send(json.dumps({"type":"auth", "status":"success"})) # TODO: response jwt check result
    intra_id = token # TODO: get intra_id from jwt
    return (intra_id, game_type, alias)

async def listen_port(port):
    global lobby
    global users
    async with serve(accept, "backend", port):
        print(f"open game server port:{port}")
        while True:
            await asyncio.sleep(1)
            await lobby.match()
            for idx in range(len(users) -1, -1, -1):
                user = users[idx]
                if user.is_open() == False:
                    users.remove(user)
                

def start_server(port):
    asyncio.run(listen_port(port))
