import * as ws from 'ws';
import WebSocket = require("ws");
import {WSMessage} from "./models/WSMessage";
import {WSUser} from "./models/WSUser";
import {ChatRoom} from "./models/ChatRoom";
import {pi} from "./Connection";

let serverParams = {
    port: 8888
};

let userCount = 0;
let roomsCount = 0;
let roomMessagesLimit = 5;

let rooms: Map<number, ChatRoom> = new Map<number, ChatRoom>();
let users: Map<number, WSUser> = new Map<number, WSUser>();

let wss = new ws.Server(serverParams, () => {
    console.log('WSS serveris veikia ant porto ' + serverParams.port + pi);
});

wss.on('connection', (ws: WebSocket, req: any) => {
    console.log(req.headers.cookie);
    // Vartotojas pridedamas į vartotojų sąrašą
    let user = new WSUser(++userCount, ws);
    users.set(user.id, user);

    // Čia ant bajerio, galim ir suskaldyt, kad būtų lengviau skaityti :D~
    ws.send(JSON.stringify(new WSMessage('rooms-update', JSON.stringify(Array.from(rooms.values())))));

    console.log(`Klientas ${user.id} prisijungė prie serverio.`);

    // Kai gaunama žinutė iš vartotojo
    ws.addEventListener('message', (message: any) => {
        let data: WSMessage = JSON.parse(message.data);
        switch (data.type) {
            case 'chat-message':
                // Pokalbių žinutė siunčiama visiems prisijungusiems vartotojams, kurie yra tame pačiame kambaryje
                let r = rooms.get(user.roomId);

                if (r.messages.length >= roomMessagesLimit) {
                    r.messages.splice(1, 1);
                }

                r.messages.push(data.params);

                let message = new WSMessage('chat-message', data.params);
                if (r) {
                    r.users.forEach((usr: WSUser) => {
                        usr.ws.send(JSON.stringify(message));
                    });
                }

                // users.forEach((u: WSUser, key: number) => {
                //     u.ws.send(JSON.stringify(data));
                // });
                break;

            // Vartotojas kuria kambarį
            case 'create-room':
                console.log(`Vartotojas ${user.id} bando sukurti pokalbių kambarį ${data.params}.`);
                let room = new ChatRoom(++roomsCount, data.params);
                room.users.set(user.id, user);
                rooms.set(room.id, room);


                addUserToRoom(user, room.id);
                roomsUpdates();
                break;

            // Vartotojas bando prisijungti prie kambario
            case 'join-room':
                addUserToRoom(user, data.params);
                break;
        }
    });

    ws.addEventListener('close', () => {
        let room = rooms.get(user.roomId);

        if (room) {
            room.users.delete(user.id);

            if (room.users.size === 0) {
                rooms.delete(room.id);
                roomsUpdates();
            }
        }

        users.delete(user.id);
    });
});

function addUserToRoom(user: WSUser, roomId: number): void {
    if (user.roomId !== roomId) {
        let room = rooms.get(user.roomId);

        if (room) {
            room.users.delete(user.id);

            if (room.users.size === 0) {
                rooms.delete(room.id);
                roomsUpdates();
            }
        }

        rooms.get(roomId).users.set(user.id, user);
        user.roomId = roomId;
        sendRoomJoined(user, rooms.get(user.roomId));
    }
}

function roomsUpdates(): void {
    let roomsArray = Array.from(rooms.values());

    users.forEach((user: WSUser) => {
        if (user.ws.readyState !== user.ws.CLOSED)
            user.ws.send(JSON.stringify(new WSMessage('rooms-update', JSON.stringify(roomsArray, replaceUsers))));
    });
}

function sendRoomJoined(user: WSUser, room: ChatRoom): void {
    let message = new WSMessage('room-join', JSON.stringify(room, replaceUsers));
    user.ws.send(JSON.stringify(message));
}

function replaceUsers(key: string, value: any): any {
    if (key === 'users')
        return undefined;

    return value;
}

wss.on('error', () => {
    console.log('Serverio klaida');
});