import * as WebSocket from 'ws';

export class WSUser {
    id: number;
    ws: WebSocket;
    roomId: number;

    constructor(id: number, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
        this.roomId = 0;
    }
}