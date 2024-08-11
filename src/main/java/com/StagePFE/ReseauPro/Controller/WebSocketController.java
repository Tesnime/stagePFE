package com.StagePFE.ReseauPro.Controller;

import com.StagePFE.ReseauPro.Model.ChatMessag;
import com.StagePFE.ReseauPro.Model.ChatNotification;
import com.StagePFE.ReseauPro.Service.ChatRoomService;
import com.StagePFE.ReseauPro.dio.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class WebSocketController {

    private final ChatRoomService chatRoomService;
    private final SimpMessagingTemplate simpMessagingTemplate;
//    @MessageMapping("chatt/{roomId}")
//    @SendTo("/topic/{roomId}")
//    public ChatMessage chat(@DestinationVariable String roomId , ChatMessage message){
//        System.out.println(message);
//        return new ChatMessage(message.getMessage(), message.getUser());
//    }
    @MessageMapping("chat")
    public void processMessage(
            @Payload ChatMessag chatMessag
    ){
        ChatMessag savedMsg = chatRoomService.save(chatMessag);
        simpMessagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessag.getRecipientId()),"/queue/messages",
                ChatNotification.builder()
                        .id(savedMsg.getId())
                        .senderId(savedMsg.getSenderId())
                        .recipientId(savedMsg.getRecipientId())
                        .message(savedMsg.getMessage())
                        .build()
        );
    }
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessag>> findChatMessages(
            @PathVariable("senderId") long senderId,
            @PathVariable("recipientId") long recipientId
    ){
        return ResponseEntity.ok(chatRoomService.findChatMessages(senderId,recipientId));

    }
}
