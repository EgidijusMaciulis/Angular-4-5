import {WSUser} from "./WSUser";
import {ChatMessage} from "./ChatMessage";

export class ChatRoom {
    id: number;
    name: string;
    users: Map<number, WSUser>;
    messages: ChatMessage[];

    constructor(id: number, name: string) {
        this.messages = [];
        this.id = id;
        this.name = name;
        this.users = new Map<number, WSUser>()
    }
}