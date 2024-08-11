package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Data
@Entity
@Table(name = "answers")
public class Answers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Lob
    @Column(name = "reponse", length = 512)
    private String reponse;

    private Date date;

    @ManyToOne()
    @JoinColumn(name = "apprenant_id")
    private Apprenant apprenant;

    @ManyToOne()
    @JoinColumn(name = "question_id")
//    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Questions questions;

}
