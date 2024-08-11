package com.StagePFE.ReseauPro.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
@Builder
@Table(name ="chatMessage")
@Entity
public class ChatMessag {
    @Id
    private String id;
    private String chatId;
    private long senderId;
    private long recipientId;
    private String message;
    private Date temps;
}
