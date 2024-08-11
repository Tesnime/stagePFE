package com.StagePFE.ReseauPro.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "feedback")
public class interactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ElementCollection
    private List<String> difficultes;

    @ElementCollection
    private List<String> centreInteret;

    private String objectif;



    @ManyToMany
    @JoinTable(name = "apprenant_interactions",
            joinColumns =@JoinColumn(name = "interaction_id"),
            inverseJoinColumns = @JoinColumn(name = "apprenant_id"))
    private List<Apprenant> apprenants ;


}
