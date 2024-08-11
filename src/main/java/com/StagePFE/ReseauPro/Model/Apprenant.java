package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "apprenant")
public class Apprenant extends User{

    private String cin;

    private Date naissance;

    private String poste;

    private String societe;

    private String tel;

    private String telFix;

    private String adrress;
    private String codeConfirmation;


    @ManyToMany
    @JsonIgnore
    @JoinTable(name = "apprenant_demande",
            joinColumns = @JoinColumn(name = "apprenant_id"),
            inverseJoinColumns = @JoinColumn(name = "demande_id"))
    private List<Demande> demandes;

    @ManyToMany
    @JsonIgnore
    @JoinTable(name = "apprenant_interactions",
            joinColumns = @JoinColumn(name = "apprenant_id"),
            inverseJoinColumns = @JoinColumn(name = "interaction_id"))
    private List<interactions> interactions;

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<EvaluationApprenant> evaluationApprenants;


    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL)
    private List<Certification> certifications;

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Presence> presences;

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Comments> comments;


    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Taches> taches;

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Questions> questions;

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Answers> answers;
}
