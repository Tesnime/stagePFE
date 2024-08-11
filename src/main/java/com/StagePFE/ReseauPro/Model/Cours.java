package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "cours")
public class Cours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nom;
    private String cours;
    private String description;
    private String theme;
    @Temporal(TemporalType.TIMESTAMP)
    private Date date_depo;

    @ManyToOne
    @JoinColumn(name = "formateur_id")
    private Formateur formateur;
}
