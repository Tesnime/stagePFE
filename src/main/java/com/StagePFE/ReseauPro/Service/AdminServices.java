package com.StagePFE.ReseauPro.Service;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.dio.DemandeWithFirstSessionDate;
import com.StagePFE.ReseauPro.dio.DemandeWithSessionsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AdminServices {
    List<Demande> demandes();

    List<Formateur> formateurs();

    List<Demande> demandesTerminer();

    List<Demande> demandesAcceptes();

    int demandesEnTraitement();

    List<Session> sessions();

    Demande demandeId(Long id);

    List<ExprPro> expr(Long userId);

    List<Presence> presenceList(long sessionId);

    int presencenbr(long sessionId);

    List<FormAcademique> Form(Long userId);

    Demande refus(Demande demande, long id);

    Demande accept( long id);

    Demande terminer(long id);

    Session session(Session session, long demandeId);

    Session updateSession(Session session, long id);


//    Map<String, Map<String, Long>> getStatistics();

    Map<String, Map<String, Long>> getStatistics(long id);

    List<EvaluationApprenant> evaluationApprenantList(long id);

    Double getStar(long demandeID);

    Map<String, Integer> getStat();

    Presence getApprenantStat(Long apprenantId, Long sessionId);

    List<Object[]> getAllInteractionsGroupedByInterests();

    List<Object[]> getAllInteractionsGroupedByDifficultes();

    double calculatePresenceRate(long sessionId);

    double calculateOverallPresenceRateByFormateur();

    Demande ajoutFormation(Demande demande);

    Demande updateDemande(Long id, Demande demandeDetails);

    Demande addFormateurToDemande(Long demandeId, Long formateurId);

    ResponseEntity<String> storeFile(MultipartFile file);

//    ResponseEntity<String> storecerificate(MultipartFile file, Demande demande);

    List<Certification> getCertificate();

//    byte[] generateCertificate(String name, String thematic, String date, String template) throws IOException;

//    byte[] modifyPdf(Long certId, long demandeId) throws IOException;

    byte[] modifyPdf(Long certId, Long demandeId) throws IOException;

    byte[] modifyPdfName(Long certId, Long apprenantId) throws IOException;

    ResponseEntity<String> modifyCertificate(Long certId, long demandeId);

    ResponseEntity<String> modifyCertificateApprenant(Long certId, long apprenantId);

    Optional<Session> getFirstSessionByFormateur(long formateurId);

    List<DemandeWithSessionsDTO> getSessionsGroupedByDemande();

    List<Session> example(long id);

    List<DemandeWithFirstSessionDate> getDemandesByFormateurId(long id);

    Map<String, Double> calculateThemePercentages(long formateurId);

    Map<String, Double> calculatePercentagesForFormateur(long formateurId);

    double calculatePresenceRateByFormateur(long formateurId);

    double calculateStarRateByFormateur(long formateurId);

    Map<String, Map<String, Double>> calculateResponseDistributionsByFormateur(long formateurId);

    Map<String, Double>  calculateAllDemandeThemePercentages();

    List<Presence> findPresence(long apprenantId, long sessionId);

    List<Presence> findFormateurPresence(long formateurId, long sessionId);

    List<Session> sessionsByDemande(long demandeId);

    void deleteSessionById(Long id);
}
