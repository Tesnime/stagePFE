package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "formateur")
public class Formateur extends User {

    private String bio;


    private String CIN;

    private Date naissance;

    private String tel;
    private String poste;

    private String adresse;
    @ElementCollection
    private List<String> competance;
    @ElementCollection
    private List<String> comTech;

    private String autre;

    private String rib;

    @Lob
    @Column(name = "cv", columnDefinition = "LONGBLOB")
    private byte[] cv;
    private String portfolio;
    private String linkedin;


    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Cours> cours;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Comments> comments;


//    @OneToOne
//    @JoinColumn(name = "UserId")
//    @JsonManagedReference
//    private User user;


    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL,orphanRemoval = true)
//    @JsonIgnore
    private List<FormAcademique> formAcademique;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL,orphanRemoval = true)
//    @JsonIgnore
    private List<ExprPro> experiencePro;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<EvaluationFormateur> evaluation;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Demande> demandes;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Presence> presences;

    @ManyToMany
    @JsonIgnore
    @JoinTable(name = "formateur_demande",
            joinColumns = @JoinColumn(name = "formateurPropose_id"),
            inverseJoinColumns = @JoinColumn(name = "demande_id"))
    private List<Demande> demande;

}
