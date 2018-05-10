"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws = require("ws");
var WSMessage_1 = require("./models/WSMessage");
var WSUser_1 = require("./models/WSUser");
var ChatRoom_1 = require("./models/ChatRoom");
var Connection_1 = require("./Connection");
var serverParams = {
    port: 8888
};
var userCount = 0;
var roomsCount = 0;
var roomMessagesLimit = 5;
var rooms = new Map();
var users = new Map();
var wss = new ws.Server(serverParams, function () {
    console.log('WSS serveris veikia ant porto ' + serverParams.port + Connection_1.pi);
});
wss.on('connection', function (ws, req) {
    console.log(req.headers.cookie);
    // Vartotojas pridedamas į vartotojų sąrašą
    var user = new WSUser_1.WSUser(++userCount, ws);
    users.set(user.id, user);
    // Čia ant bajerio, galim ir suskaldyt, kad būtų lengviau skaityti :D~
    ws.send(JSON.stringify(new WSMessage_1.WSMessage('rooms-update', JSON.stringify(Array.from(rooms.values())))));
    console.log("Klientas " + user.id + " prisijung\u0117 prie serverio.");
    // Kai gaunama žinutė iš vartotojo
    ws.addEventListener('message', function (message) {
        var data = JSON.parse(message.data);
        switch (data.type) {
            case 'chat-message':
                // Pokalbių žinutė siunčiama visiems prisijungusiems vartotojams, kurie yra tame pačiame kambaryje
                var r = rooms.get(user.roomId);
                if (r.messages.length >= roomMessagesLimit) {
                    r.messages.splice(1, 1);
                }
                r.messages.push(data.params);
                var message_1 = new WSMessage_1.WSMessage('chat-message', data.params);
                if (r) {
                    r.users.forEach(function (usr) {
                        usr.ws.send(JSON.stringify(message_1));
                    });
                }
                // users.forEach((u: WSUser, key: number) => {
                //     u.ws.send(JSON.stringify(data));
                // });
                break;
            // Vartotojas kuria kambarį
            case 'create-room':
                console.log("Vartotojas " + user.id + " bando sukurti pokalbi\u0173 kambar\u012F " + data.params + ".");
                var room = new ChatRoom_1.ChatRoom(++roomsCount, data.params);
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
    ws.addEventListener('close', function () {
        var room = rooms.get(user.roomId);
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
function addUserToRoom(user, roomId) {
    if (user.roomId !== roomId) {
        var room = rooms.get(user.roomId);
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
function roomsUpdates() {
    var roomsArray = Array.from(rooms.values());
    users.forEach(function (user) {
        if (user.ws.readyState !== user.ws.CLOSED)
            user.ws.send(JSON.stringify(new WSMessage_1.WSMessage('rooms-update', JSON.stringify(roomsArray, replaceUsers))));
    });
}
function sendRoomJoined(user, room) {
    var message = new WSMessage_1.WSMessage('room-join', JSON.stringify(room, replaceUsers));
    user.ws.send(JSON.stringify(message));
}
function replaceUsers(key, value) {
    if (key === 'users')
        return undefined;
    return value;
}
wss.on('error', function () {
    console.log('Serverio klaida');
});
