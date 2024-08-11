package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "experiencePro")
public class ExprPro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String poste;
    private String entreprise;
    private String lieu;
    private String debut;
    private String fin;
    private Boolean working;
    @ManyToOne
    @JoinColumn(name = "formateur_id")
    @JsonIgnore
    private Formateur formateur;
}
