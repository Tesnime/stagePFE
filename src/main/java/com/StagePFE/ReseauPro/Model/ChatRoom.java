package com.StagePFE.ReseauPro.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.lang.annotation.Documented;

@Data
@AllArgsConstructor
@Table(name = "chatRoom")
@Builder
@Entity
public class ChatRoom {
    @Id
    private String id;

    private String chatId;
    private long senderId;
    private long recipientId;


}
