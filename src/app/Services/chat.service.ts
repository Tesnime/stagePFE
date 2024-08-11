import { ChatMessage } from './../chat/chat/models/chat-message';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient:any;
  private messageSubject: BehaviorSubject<ChatMessage[]>= new BehaviorSubject<ChatMessage[]>([]);


  constructor() { 
    this.initConnectionSocket();
  }

  initConnectionSocket(){
    const url = '//localhost:8080/chat-socker';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinRoom(roomId: string){
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe(`/topic/${roomId}`,(message:any)=>{
        const messageContent = JSON.parse(message.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);

        this.messageSubject.next(currentMessage);

      })
    })
  }

  sendMessge(roomId:string ,chatMessage: ChatMessage){
    this.stompClient.send(`/app/chatt/${roomId}`, {}, JSON.stringify(chatMessage));
  }


  getMessageSubject(){
    return this.messageSubject.asObservable();
  }

  
}
