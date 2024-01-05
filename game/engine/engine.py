#!/usr/bin/env python

import json
import asyncio
from websockets.server import serve, WebSocketServerProtocol
from engine.User import User
from phong.PhongGame import PhongGame
from engine.util import now

lobby = {"phong":[]}

async def accept(websocket: WebSocketServerProtocol):
    global lobby
    print(websocket.id, "accept:", websocket.request_headers.get("Origin"), websocket.path)
    try:
        raw_info = await asyncio.wait_for(websocket.recv(), timeout=10)
        info = json.loads(raw_info)
        token, game_type = (info.get("token"), info.get("game"))
        if token == None:
            raise "err"
        if game_type == None or lobby.get(game_type) == None:
            raise "err"
        print(websocket.id, "token:", token) # TODO: jwt validate check
    except asyncio.exceptions.CancelledError:
        print(websocket.id, "timeout")
        return
    except:
        print(websocket.id, "invalid")
        return
    user = User(websocket, token, game_type) # TODO: get intra_id from jwt
    lobby[game_type].append(user)
    user.onclose = leave_lobby
    async for message in websocket:
        try:
            await user.recv_json(json.loads(message))
        except Exception as e:
            print(e)
            break
    if user.onclose is not None:
        print(websocket.id, "close")
        await user.onclose(user)

async def leave_lobby(user):
    global lobby
    lobby[user.game_type].remove(user)

async def listen_port(port):
    global lobby
    async with serve(accept, "game", port):
        print(f"open game server port:{port}")
        while True:
            await asyncio.sleep(1)
            game = await PhongGame.phong_match(lobby.get("phong"))
            if game == None:
                continue
            asyncio.create_task(game.loop())

def start_server(port):
    asyncio.run(listen_port(port))
