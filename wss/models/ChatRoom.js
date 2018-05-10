"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatRoom = /** @class */ (function () {
    function ChatRoom(id, name) {
        this.messages = [];
        this.id = id;
        this.name = name;
        this.users = new Map();
    }
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
