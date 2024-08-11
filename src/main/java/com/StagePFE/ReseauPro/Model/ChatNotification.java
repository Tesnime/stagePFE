package com.StagePFE.ReseauPro.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Table(name = "chatNotif")
@Builder
@Entity
public class ChatNotification {
    @Id
    private String id;
    private long senderId;
    private long recipientId;
    private String message;
}
