package com.StagePFE.ReseauPro.Service;

import com.StagePFE.ReseauPro.Model.*;
import jakarta.mail.MessagingException;

import java.util.List;

public interface ApprenantServices {
    Apprenant apprenant(Long userId);

    Apprenant UpdateApprenant(Long userId, Apprenant apprenantDetails);

    Apprenant code(Long userId, String code);

    void addApprenantToDemande(Long id, String code);

    void ajoutPresent(String code,long id);

    List<Apprenant> getApprenantsByDemandeId(Long demandeId);

    EvaluationApprenant eval(EvaluationApprenant eval, long userId, long sessionId);

    EvaluationApprenant evalStar(int eval, long userId, long sessionId);

    long demandIdByCode(String code);

    List<Session> getSessionsByApprenantId(long apprenantId);

//    List<Session> getCurrentSessionsByApprenantId(int apprenantId);

    List<Session> getCurrentSessionsByApprenantId(long apprenantId);

//    void sendVerificationEmail(String to, String msg);

    void sendVerificationEmail(String to, String code, String nom) throws MessagingException;

    void sendInscriptionEmail(String to, String nom, long demandeId) throws MessagingException;

    void markPresence(Long apprenantId, Long sessionId, boolean present);

    //    @Override
    //    public boolean present(Long sessionId, Long apprenantId) {
    //        List<Presence> p=presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId);
    //        System.out.println("hell: "+p);
    //        if ( presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId).isEmpty()) {
    //            System.out.println("hello");
    //            return false;
    //        }
    //        return p.get(0).isPresent();
    //    }
    void donnee(Long apprenantId, Long sessionId, Presence p);

    Comments addComments(Comments comments, long userId, long id);

    boolean present(Long sessionId, Long apprenantId);

    Presence donnee(Long apprenantId, Long sessionId);

    List<Certification> getCertificationsByDemandeId(Long apprenantId, Long demandeId);

    List<Demande> getDemandesByApprenantId(Long apprenantId);

    List<Session> getSessionsByDemandeId(Long demandeId);

    List<Presence> getPresenceForApprenantInDemande(Long apprenantId, long demandeId);

    Taches addTache(String tache, long id);

    void deleteTask(Long id);

    List<Taches> getTachesByApprenantId(long apprenantId);

    Questions addQuestion(Questions question, long id);

    List<Questions> getAllQuestion();

    List<Questions> getQuestionsByApprenantId(long apprenantId);

    Answers updateAnswer(Long id, Answers answerDetails);

    void deleteAnswer(Long id);

    Answers addAnswer(Long apprenantId, Long questionId, Answers answerDetails);
}
