import {Component, OnInit} from '@angular/core';
import {WSMessage} from '../../models/WSMessage';
import {FormControl} from '@angular/forms';
import {ChatRoom} from '../../models/ChatRoom';
import {ChatMessage} from '../../models/ChatMessage';
import {ContextService} from '../../services/context.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./style.css']
})
export class ChatComponent implements OnInit {
  connection: WebSocket;
  messageControl: FormControl;
  roomInputControl: FormControl;

  chatMessages: ChatMessage[];
  chatData: ChatRoom;

  chatRooms: ChatRoom[];

  constructor(public context: ContextService) {
    this.chatMessages = [];
    this.messageControl = new FormControl();
    this.roomInputControl = new FormControl();

    document.cookie = `Token=${context.user.token}`;
    this.connection = new WebSocket('ws://localhost:8888');

    this.connection.addEventListener('open', () => {
      console.log('Prisijungėme prie WSS');
    });

    this.connection.addEventListener('message', (message: MessageEvent) => {
      let data: WSMessage = JSON.parse(message.data);

      switch (data.type) {
        case 'chat-message':
          this.chatMessages.push(data.params);
          break;
        case 'rooms-update':
          console.log('Gauti kambariai', JSON.parse(data.params));

          this.chatRooms = JSON.parse(data.params);
          break;
        case 'room-join':
          let room = JSON.parse(data.params);
          this.chatMessages = room.messages;
          console.log('Vartotojas prisijunge prie kambario', data.params);
          this.chatData = JSON.parse(data.params);
          break;
      }

    });
  }

  ngOnInit() {
  }

  joinRoom(roomId: number): void {
    let message = new WSMessage('join-room', roomId);
    this.connection.send(JSON.stringify(message));
  }

  sendChatMessage(): void {
    let message: ChatMessage = {
      sender: this.context.user.name,
      content: this.messageControl.value
    };

    this.connection.send(JSON.stringify(new WSMessage('chat-message', message)));
    this.messageControl.reset();
  }

  createRoom(): void {
    let msg = {
      type: 'create-room',
      params: this.roomInputControl.value
    };

    this.connection.send(JSON.stringify(msg));
    this.roomInputControl.reset();
  }
}
