package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "taches")
public class Taches {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String tache;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "apprenant_id")
    @JsonIgnore
    private Apprenant apprenant;


}
