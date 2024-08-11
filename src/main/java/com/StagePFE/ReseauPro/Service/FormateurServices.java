package com.StagePFE.ReseauPro.Service;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.dio.DemandeWithSessionsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Map;

public interface FormateurServices {

    Formateur uploadCv (Long id, MultipartFile file);

    Formateur UpdateAutre(Long userId, Formateur formateurDetails);

    ResponseEntity<byte[]> getCv(Long userId);

    Cours addCourses(Cours cours, long id);
    List<Cours> coursByID(long id);
    Cours UpdateCours(Long id,Cours cours);
    Formateur Formateur(Long userId);
    Formateur UpdateFormateur(Long userId, Formateur formateurDetails);

    Session sessionId(Long id);

    ExprPro expre(ExprPro exprPro, long id);
    List<ExprPro> expr(Long userId);

    FormAcademique UpdateForm(Long id, FormAcademique facad);

    ExprPro UpdateExpr(Long id, ExprPro exprr);

    String deleteformation(Long id);

    String deleteExperience(Long id);

    FormAcademique addForm(FormAcademique formAcademique, long id);
    List<FormAcademique> Form(Long userId);


    FormAcademique FormationByid(Long id);

    ExprPro ExprByid(Long id);

    EvaluationFormateur eval(EvaluationFormateur eval, long userId, long sessionId);
    Demande postuler(Demande demande, long id);

    Demande demande(Long userId);

    String deletedemande(Long id);

    List<Session> sessions(long id);
    List<Session> sessionsByFormateur(long id);
    List<Demande> demandes(long id);


    Comments addComments(Comments cours, long userId, long id);

    List<Comments> comments(Long id);

    List<Demande> getDemandesByStatus();

    List<DemandeWithSessionsDTO> getSessionsGroupedByDemande();

    @Transactional
    void addFormateurToDemande(Long demandeId, Long formateurId);

    void markPresence(Long formateurId, Long sessionId, boolean present);

    boolean present(Long formateurId, Long sessionId);

    long getTotalSessionsForFormateur(long formateurId);

    double getAverageApprenantsPerSession(long formateurId);

    Map<String, Long> getFirstAndLastSessionIdsByDate(long demandeId);
}
