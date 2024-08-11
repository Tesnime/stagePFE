package com.StagePFE.ReseauPro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "demande")
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    private Formateur formateur;

    private int nbrSession;
    @ElementCollection
    private List<String> theme;
    private String titre;
    @Column(name = "description", length = 10000)
    private String description;
    private Date date;
    private String doc;
    private String raison;
    private String status;
    @Column(unique = true)
    private String code;

    @OneToMany(mappedBy = "demande", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Session> sessions;

    @ManyToMany
    @JoinTable(name = "apprenant_demande",joinColumns = @JoinColumn(name = "demande_id"),inverseJoinColumns = @JoinColumn(name = "apprenant_id"))
    private List<Apprenant> apprenants ;

    @ManyToMany
    @JoinTable(
            name = "formateur_demande",
            joinColumns = @JoinColumn(name = "demande_id"),
            inverseJoinColumns = @JoinColumn(name = "formateurPropose_id")
    )
    private List<Formateur> formateurPropose;

    @OneToMany(mappedBy = "demande2", cascade = CascadeType.ALL,orphanRemoval = true)
//    @JsonIgnore
    private List<EvaluationApprenant> evaluationApprenants;

    @OneToMany(mappedBy = "demande", cascade = CascadeType.ALL,orphanRemoval = true)
//    @JsonIgnore
    private List<Certification> certifications;

    @OneToMany(mappedBy = "demande1", cascade = CascadeType.ALL,orphanRemoval = true)
//    @JsonIgnore
    private List<EvaluationFormateur> evaluationFormateurs;
}
