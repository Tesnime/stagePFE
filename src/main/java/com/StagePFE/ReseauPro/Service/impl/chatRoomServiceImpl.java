package com.StagePFE.ReseauPro.Service.impl;

import com.StagePFE.ReseauPro.Model.ChatMessag;
import com.StagePFE.ReseauPro.Model.ChatRoom;
import com.StagePFE.ReseauPro.Repository.ChatMessageRepository;
import com.StagePFE.ReseauPro.Repository.ChatRoomRepository;
import com.StagePFE.ReseauPro.Service.ChatRoomService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class chatRoomServiceImpl implements ChatRoomService {

    private ChatRoomRepository chatRoomRepository;
    private ChatMessageRepository chatMessageRepository;
    @Override
    public Optional<String> getChatRoomId(long senderId, long recipientId, boolean createNewRoom){
        return chatRoomRepository.findBySenderIdAndRecipientId(senderId,recipientId)
                .map(ChatRoom::getChatId )
                .or(()->{
                    if (createNewRoom){
                        var chatId=createChatId(senderId,recipientId);
                        return Optional.of(chatId);
                    }
                    return Optional.empty();
                });

    }

    private String createChatId(long senderId, long recipientId) {
        var chatID=String.format("%s_%s",senderId,recipientId);
        ChatRoom senderRecipient=ChatRoom.builder()
                .chatId(chatID)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();

        ChatRoom recipientSender=ChatRoom.builder()
                .chatId(chatID)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();
        chatRoomRepository.save(recipientSender);
        chatRoomRepository.save(senderRecipient);
        return chatID;
    }

    @Override
    public ChatMessag save(ChatMessag message){
        var chatId=getChatRoomId(message.getSenderId(), message.getRecipientId(),true).orElseThrow();
        message.setChatId(chatId);
        chatMessageRepository.save(message);
        return message;
    }

    @Override
    public List<ChatMessag> findChatMessages(long senderId,long recipientId){
        var chatId=getChatRoomId(senderId,recipientId,false);
        return chatId.map(chatMessageRepository::findByChatId).orElse(new ArrayList<>());
    }

}
