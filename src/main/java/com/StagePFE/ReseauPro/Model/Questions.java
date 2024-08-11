package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "question")
public class Questions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String titre;
    private String question;
    private Date date;
    @ElementCollection
    private List<String> tags;

    @ManyToOne
    @JoinColumn(name = "apprenant_id")
    private Apprenant apprenant;

    @OneToMany(mappedBy = "questions", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Answers> answers;
}
