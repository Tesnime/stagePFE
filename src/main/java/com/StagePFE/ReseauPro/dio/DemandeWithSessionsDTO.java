package com.StagePFE.ReseauPro.dio;

import com.StagePFE.ReseauPro.Model.Demande;
import com.StagePFE.ReseauPro.Model.Session;
import lombok.Data;

import java.util.List;

@Data
public class DemandeWithSessionsDTO {
    private Demande demande;
    private List<Session> sessions;

    public DemandeWithSessionsDTO(Demande demande, List<Session> sessions) {
        this.demande = demande;
        this.sessions = sessions;
    }

}
