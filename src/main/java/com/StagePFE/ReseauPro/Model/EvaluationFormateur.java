package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "evaluation_formateur", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"formateur_id", "session_id"})
})
public class EvaluationFormateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;


    @ManyToOne
    @JoinColumn(name = "formateur_id")
    private Formateur formateur;

    @ManyToOne
    @JoinColumn(name = "demande_id")
    @JsonIgnore
    private Demande demande1;
}
