package com.StagePFE.ReseauPro.Service;

import com.StagePFE.ReseauPro.Model.ChatMessag;
//import com.StagePFE.ReseauPro.Model.ChatMessage;

import java.util.List;
import java.util.Optional;

public interface ChatRoomService {
    Optional<String> getChatRoomId(long senderId, long recipientId, boolean createNewRoom);

//    ChatMessage save(ChatMessage message);

    ChatMessag save(ChatMessag message);

    List<ChatMessag> findChatMessages(long senderId, long recipientId);
}
