package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.ChatMessag;
import com.StagePFE.ReseauPro.dio.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessag,String> {
    List<ChatMessag> findByChatId(String s);
}
