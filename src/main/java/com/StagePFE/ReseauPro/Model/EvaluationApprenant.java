package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "evaluation_apprenant", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"apprenant_id", "session_id"})
})
public class EvaluationApprenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;
    private String q6;
    private String comQ1;
    private String comQ2;
    private String comQ3;
    private String comQ4;
    private String comQ5;
    private String comQ6;
    private int star;

    @ManyToOne
    @JoinColumn(name = "apprenant_id", nullable = false)
    private Apprenant apprenant;

    @ManyToOne
    @JoinColumn(name = "demande_id", nullable = false)
    @JsonIgnore
    private Demande demande2;
}
