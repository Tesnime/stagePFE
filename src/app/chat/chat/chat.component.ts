import { map } from 'rxjs';
import { Message } from './../../../../node_modules/@stomp/stompjs/src/i-message';
import { ChatMessage } from './models/chat-message';
import { Component, OnInit } from '@angular/core';
// import { ChatService } from '../../Services/chat.service';
import { UserStorageService } from '../../Services/storage/user-storage.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent{
  messageInput: string = '';
  userId = UserStorageService.getUserId();
  messageList: any[] = [];
  
  constructor(private chatService: ChatService, private route: ActivatedRoute) {}
  
  ngOnInit(): void { 
    this.chatService.joinRoom('ABC');
    this.listenForMessages();
  }
  
  sendMessage() {
    const chatMessage = {
      message: this.messageInput,
      user: this.userId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.chatService.sendMessge('ABC', chatMessage);
  
    // Ajouter le message directement à la liste
    const newMessage = {
      ...chatMessage,
      message_side: 'sender'
    };
    this.messageList = [...this.messageList, newMessage];
  
    this.messageInput = ''; // Réinitialiser l'entrée du message après l'envoi
  }
  
  
  listenForMessages() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      // Créer une nouvelle instance de messageList
      this.messageList = messages.map((item: any) => ({
        ...item,
        message_side: item.user === this.userId ? 'sender' : 'receiver',
        time: item.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      console.log("messageList:", this.messageList);
    });
  }
  
}
