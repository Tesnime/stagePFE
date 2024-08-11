package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "formationAcad")
public class FormAcademique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String diplome;
    private String etablissement;
    private String date;
    private String specialite;
    private String preuve;
    @ManyToOne
    @JoinColumn(name = "formateur_id")
    @JsonIgnore
    private Formateur formateur;
}
