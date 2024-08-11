package com.StagePFE.ReseauPro.Service.impl;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.Repository.*;
import com.StagePFE.ReseauPro.Service.ApprenantServices;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.transaction.annotation.Transactional;


import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApprenantServicesImpl implements ApprenantServices {

    private final ApprenantRepository apprenantRepository;
    private final DemandeRepository demandeRepository;
    private final CommentsRepository commentsRepository;
    private final SessionRepository sessionRepository;
    private final EvaluationApprenantRepository evaluationRepository;
    private final CertificationRepository certificationRepository;
    private final TacheRepository tacheRepository;
    private final QuestuionsRepository questuionsRepository;
    private final AnswersRepository answersRepository;
    @Autowired
    private PresenceRepository presenceRepository;
    @Autowired
    private JavaMailSender mailSender;

    @Override
    public Apprenant apprenant(Long userId) {
        if (apprenantRepository.findById(userId).isPresent()) {
            return apprenantRepository.findById(userId).get();
        }
        return null;
    }
    @Override
    public Apprenant UpdateApprenant(Long userId, Apprenant apprenantDetails) {
        return apprenantRepository.findById(userId).map(p -> {
            p.setEmail(apprenantDetails.getEmail());
            p.setFirstname(apprenantDetails.getFirstname());
            p.setLastname(apprenantDetails.getLastname());
            p.setNaissance(apprenantDetails.getNaissance());
            p.setTel(apprenantDetails.getTel());
            p.setAdrress(apprenantDetails.getAdrress());
            p.setTelFix(apprenantDetails.getTelFix());
            p.setSociete(apprenantDetails.getSociete());
            p.setCin(apprenantDetails.getCin());

            return apprenantRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Formateur non trouve "));
    }

    @Override
    public Apprenant code(Long userId, String code) {
        return apprenantRepository.findById(userId).map(p -> {
            p.setCodeConfirmation(code);
            return apprenantRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Formateur non trouve "));
    }
    @Override
    public void addApprenantToDemande(Long id, String code) {
        // Find the demande by code
        Demande demande = demandeRepository.findByCode(code);

        if (demande != null) {
            // Find the apprenant by ID
            Apprenant apprenant = apprenantRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid apprenantId"));

            // Vérifier si l'apprenant est déjà associé à la demande
            if (!demande.getApprenants().contains(apprenant)) {
                demande.getApprenants().add(apprenant);
                // Update the demande
                demandeRepository.save(demande);
            } else {
                throw new IllegalArgumentException("Apprenant is already associated with the demande");
            }
        } else {
            throw new IllegalArgumentException("No demande found with the provided code");
        }
    }
    @Override
    public void ajoutPresent(String code, long id) {
       Demande demande = demandeRepository.findByCode(code);
       List<Session> sessions=demande.getSessions();
       List<Apprenant> apprenants=demande.getApprenants();
        for (Session session:sessions) {
                markPresence(id, session.getId(), false);
        }

    }
    @Override
    public List<Apprenant> getApprenantsByDemandeId(Long demandeId) {
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeId);

        // Vérifier si la demande existe
        if (demandeOptional.isPresent()) {
            // Récupérer la demande
            Demande demande = demandeOptional.get();

            // Récupérer la liste des apprenants associés à la demande
            List<Apprenant> apprenants = demande.getApprenants();

            return apprenants;
        } else {
            // Gérer le cas où la demande n'existe pas
            throw new EntityNotFoundException("Demande avec l'ID " + demandeId + " non trouvée");
        }
    }

    @Override
    @Transactional
    public EvaluationApprenant eval(EvaluationApprenant eval, long userId, long sessionId) {
        // Récupération de l'apprenant et de la demande depuis la base de données
        Apprenant user = apprenantRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Demande demande = demandeRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Vérifier si une évaluation existe déjà pour cet apprenant et cette session
        Optional<EvaluationApprenant> existingEvaluation = evaluationRepository.findByApprenantIdAndDemande2Id(userId, sessionId);
        EvaluationApprenant evaluation;
        if (existingEvaluation.isPresent()) {
            // Mettre à jour l'évaluation existante
            evaluation = existingEvaluation.get();
        } else {
            // Créer une nouvelle évaluation
            evaluation = new EvaluationApprenant();
            evaluation.setApprenant(user);
            evaluation.setDemande2(demande);
        }

        // Mettre à jour les champs de l'évaluation
        evaluation.setQ1(eval.getQ1());
        evaluation.setComQ1(eval.getComQ1());
        evaluation.setQ2(eval.getQ2());
        evaluation.setComQ2(eval.getComQ2());
        evaluation.setQ3(eval.getQ3());
        evaluation.setComQ3(eval.getComQ3());
        evaluation.setQ4(eval.getQ4());
        evaluation.setComQ4(eval.getComQ4());
        evaluation.setQ5(eval.getQ5());
        evaluation.setComQ5(eval.getComQ5());
        evaluation.setQ6(eval.getQ6());
        evaluation.setComQ6(eval.getComQ6());

        // Enregistrement de l'évaluation dans la base de données
        return evaluationRepository.save(evaluation);
    }

    @Override
    public EvaluationApprenant evalStar(int eval, long userId, long sessionId) {
        Apprenant user = apprenantRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Demande demande = demandeRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        // Vérifier si une évaluation existe déjà pour cet apprenant et cette session
        Optional<EvaluationApprenant> existingEvaluation = evaluationRepository.findByApprenantIdAndDemande2Id(userId, sessionId);
        EvaluationApprenant evaluation;
        if (existingEvaluation.isPresent()) {
            // Mettre à jour l'évaluation existante
            evaluation = existingEvaluation.get();
        } else {
            // Créer une nouvelle évaluation
            evaluation = new EvaluationApprenant();
            evaluation.setApprenant(user);
            evaluation.setDemande2(demande);
        }

        // Mettre à jour les étoiles de l'évaluation
        evaluation.setStar(eval);

        // Enregistrement de l'évaluation dans la base de données
        return evaluationRepository.save(evaluation);
    }
    @Override
    public long demandIdByCode(String code){
        return demandeRepository.findByCode(code).getId();
    }

    @Override
    public List<Session> getSessionsByApprenantId(long apprenantId) {
        Apprenant apprenant = apprenantRepository.findById(apprenantId).orElse(null);
        if (apprenant == null) {
            throw new RuntimeException("Apprenant not found");
        }

        return apprenant.getDemandes().stream()
                .flatMap(demande -> demande.getSessions().stream())
                .collect(Collectors.toList());
    }
    @Override
    public List<Session> getCurrentSessionsByApprenantId(long apprenantId) {

        Apprenant apprenant = apprenantRepository.findById(apprenantId).orElse(null);

        if (apprenant == null) {
            throw new RuntimeException("Apprenant not found");
        }

        LocalDate currentDate = LocalDate.now();

        return apprenant.getDemandes().stream()
                .flatMap(demande -> demande.getSessions().stream())
                .filter(session -> {
                    if (session.getDate() == null) {
                        return false;
                    }
                    LocalDate sessionDate = session.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    return sessionDate.equals(currentDate);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void sendVerificationEmail(String to, String code, String nom) throws MessagingException {
        String body = "<html>"
                + "<body>"
                + "Bonjour " + nom + ",<br><br>"
                + "Merci de votre inscription à la session de formation sur site de s2t. Pour confirmer votre présence, veuillez utiliser le <strong>code de vérification ci-dessous :</strong><br><br>"
                + "<strong>Code de vérification : " + code + "</strong><br><br>"
                + "Ce code est valable pendant 4 minutes. Passé ce délai, il expirera et un nouveau code devra être généré.<br><br>"
                + "Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter.<br>"
                + "Merci et à bientôt,<br><br>"
                + "L'équipe S2T"
                + "</body>"
                + "</html>";

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("[S2T] : Code de confirmation");
        helper.setText(body,true); // true indique que le contenu est HTML

        mailSender.send(mimeMessage);
    }

    @Override
    public void sendInscriptionEmail(String to, String nom, long demandeId) throws MessagingException {
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeId);

        if (!demandeOptional.isPresent()) {
            throw new MessagingException("Demande not found with id: " + demandeId);
        }

        Demande demande = demandeOptional.get();
        List<Session> sessions = demande.getSessions();
        // Sort sessions by date
        sessions.sort(Comparator.comparing(Session::getDate));

        String firstSessionDate = "";
        String lastSessionDate = "";
        String lieu = "";
        String horaire = "";

        if (!sessions.isEmpty()) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            Session firstSession = sessions.get(0);
            Session lastSession = sessions.get(sessions.size() - 1);

            if (firstSession != null && firstSession.getDate() != null) {
                firstSessionDate = dateFormat.format(firstSession.getDate());
                lieu = firstSession.getLieu();
                horaire = firstSession.getDebut() + " à " + firstSession.getFin();
            }

            if (lastSession != null && lastSession.getDate() != null) {
                lastSessionDate = dateFormat.format(lastSession.getDate());
            }
        }

        String body = "<html>"
                + "<body>"
                + "Bonjour " + nom + ",<br><br>"
                + "Votre inscription à la formation " + demande.getTitre() + ", du " + firstSessionDate + " au " + lastSessionDate + ", est confirmée.<br><br>"
                + "<strong>Détails de la formation :</strong><br>"
                + "<ul>"
                + "<li><strong>Lieu :</strong> " + lieu + "</li>"
                + "<li><strong>Horaire :</strong> " + horaire + "</li>"
                + "<li><strong>Formateur :</strong> " + demande.getFormateur().getFirstname() + " " + demande.getFormateur().getLastname() + "</li>"
                + "</ul><br>"
                + "Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter.<br><br>"
                + "Merci et à bientôt,<br>"
                + "L'équipe S2T"
                + "</body>"
                + "</html>";

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("[S2T] : Confirmation de votre inscription");
        helper.setText(body, true);

        mailSender.send(mimeMessage);
    }

    @Override
    public void markPresence(Long apprenantId, Long sessionId, boolean present) {
        List<Presence> presences = presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId);
        Presence presence;

        if (presences.isEmpty()) {
            presence = new Presence();
            presence.setApprenant(apprenantRepository.findById(apprenantId).orElseThrow(() -> new RuntimeException("Apprenant not found")));
            presence.setSession(sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found")));
        } else {
            presence = presences.get(0);
        }

        presence.setPresent(present);
        presenceRepository.save(presence);
    }
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
    @Override
    public void donnee(Long apprenantId, Long sessionId, Presence p) {
        List<Presence> presences = presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId);
        Presence presence= presences.get(0);

        presence.setManuel(p.getManuel());
        presence.setDejeuner(p.getDejeuner());
        presence.setPauseCafe(p.getPauseCafe());
        presence.setCartable(p.getCartable());
        presenceRepository.save(presence);
    }
    @Override
    public Comments addComments(Comments comments, long userId, long id) {
        Apprenant user=apprenantRepository.findById(userId).orElse(null);
        Session session=sessionRepository.findById(id).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }

        Comments c=new Comments();
        c.setApprenant(user);
        c.setSession(session);
        c.setComment(comments.getComment());
        c.setDate(new Date());
        return commentsRepository.save(c);
    }
    @Override
    public boolean present(Long apprenantId, Long sessionId) {
        List<Presence> presences = presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId);
        return presences.stream().anyMatch(Presence::isPresent);
    }
    @Override
    public Presence donnee(Long apprenantId, Long sessionId) {
        List<Presence> presences = presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId);
        return presences.get(0);
    }
    @Override
    public List<Certification> getCertificationsByDemandeId(Long apprenantId, Long demandeId) {
        return certificationRepository.findByApprenantIdAndDemandeId(apprenantId, demandeId);
    }
    @Override
    public List<Demande> getDemandesByApprenantId(Long apprenantId) {
        return demandeRepository.findDemandesByApprenantId(apprenantId);
    }

    @Override
    public List<Session> getSessionsByDemandeId(Long demandeId) {
        List<Session> sessions =sessionRepository.findByDemandeId(demandeId);
        sessions.sort(Comparator.comparing(Session::getDate));
        return sessions;
    }


    @Override
    public List<Presence> getPresenceForApprenantInDemande(Long apprenantId, long demandeId) {
        List<Session> sessions =sessionRepository.findByDemandeId(demandeId);
        sessions.sort(Comparator.comparing(Session::getDate));
        List<Presence> presences = sessions.stream()
                .flatMap(session -> session.getPresences().stream())
                .filter(presence -> presence.getApprenant() == null ||  Objects.equals(presence.getApprenant().getId(), apprenantId))
                .collect(Collectors.toList());

        // Log presence IDs where apprenant is null
        List<Long> nullApprenantIds = new ArrayList<>();
        presences.stream()
                .filter(presence -> presence.getApprenant() == null)
                .forEach(presence -> nullApprenantIds.add(presence.getId()));

        if (!nullApprenantIds.isEmpty()) {
            System.out.println("Presences with null apprenant IDs: " + nullApprenantIds);
        }

        return presences;

    }

    @Override
    public Taches addTache(String tache, long id){
        Apprenant user=apprenantRepository.findById(id).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        Taches t=new Taches();
        t.setApprenant(user);
        t.setTache(tache);
        t.setDate(new Date());
        return tacheRepository.save(t);
    }
    @Override
    public void deleteTask(Long id) {
        tacheRepository.deleteById(id);
    }
    @Override
    public List<Taches> getTachesByApprenantId(long apprenantId) {
        return tacheRepository.findByApprenantId(apprenantId);
    }
    @Override
    public Questions addQuestion(Questions question, long id) {
        Apprenant user=apprenantRepository.findById(id).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        question.setApprenant(user);
        question.setDate(new Date()); // Set the current date
        return questuionsRepository.save(question);
    }

    @Override
    public List<Questions> getAllQuestion(){
        return questuionsRepository.findAll();
    }

    @Override
    public List<Questions> getQuestionsByApprenantId(long apprenantId) {
        return questuionsRepository.findByApprenantId(apprenantId);
    }
    @Override
    public Answers updateAnswer(Long id, Answers answerDetails) {
        // Check if the answer exists
        Answers answer = answersRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Answer not found with id: " + id));

        // Update the answer details
        answer.setReponse(answerDetails.getReponse());
        answer.setDate(answerDetails.getDate()); // Optionally update the date if needed

        // Save and return the updated answer
        return answersRepository.save(answer);
    }

    @Override
    public void deleteAnswer(Long id) {
        // Check if the answer exists
        Answers answer = answersRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Answer not found with id: " + id));

        // Delete the answer
        answersRepository.delete(answer);
    }
    @Override
    public Answers addAnswer(Long apprenantId, Long questionId, Answers answerDetails) {
        // Validate existence of Apprenant
        Apprenant apprenant = apprenantRepository.findById(apprenantId)
                .orElseThrow(() -> new EntityNotFoundException("Apprenant not found with id: " + apprenantId));

        // Validate existence of Question
        Questions question = questuionsRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));

        // Create and set details of the new Answer
        Answers answer = new Answers();
        answer.setReponse(answerDetails.getReponse());
        answer.setDate(new Date());
        answer.setApprenant(apprenant);
        answer.setQuestions(question);

        // Save the new Answer
        return answersRepository.save(answer);
    }

}
