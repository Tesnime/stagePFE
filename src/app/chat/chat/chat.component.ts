import { map } from 'rxjs';
import { Message } from './../../../../node_modules/@stomp/stompjs/src/i-message';
import { ChatMessage } from './models/chat-message';
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { UserStorageService } from '../../Services/storage/user-storage.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  messageInput: string='';
  userId=UserStorageService.getUserId();
  messageList: any[]=[];

  constructor(private chatService : ChatService,
    private route:ActivatedRoute,
    ){}


  ngOnInit(): void { 
    this.chatService.joinRoom('ABC');
    this.lisenerMessage();
  }

  sendMessage(){
    const chatMessage={
      message:this.messageInput,
      user: this.userId
    }
    this.chatService.sendMessge("ABC",chatMessage);
    this.messageInput='';
  }

  lisenerMessage(){
    this.chatService.getMessageSubject().subscribe((message:any)=>{
      this.messageList= message.map((item:any)=>({
        ...item,
        message_side: item.user == this.userId ? 'sender': 'receiver'
      }))      
    });
  }
}
