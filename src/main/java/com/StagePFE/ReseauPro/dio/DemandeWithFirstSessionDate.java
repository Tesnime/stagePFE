package com.StagePFE.ReseauPro.dio;

import com.StagePFE.ReseauPro.Model.Demande;
import lombok.Data;

import java.util.Date;

@Data
public class DemandeWithFirstSessionDate {
    private Demande demande;
    private Date firstSessionDate;
    private int nbJours;
}
