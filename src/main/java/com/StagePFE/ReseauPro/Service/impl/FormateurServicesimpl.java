package com.StagePFE.ReseauPro.Service.impl;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.Repository.*;
import com.StagePFE.ReseauPro.Service.FormateurServices;
import com.StagePFE.ReseauPro.dio.DemandeWithSessionsDTO;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FormateurServicesimpl implements FormateurServices {

    private final CoursRepository coursRepository;
    private final ExprProRepository exprProRepository;
    private final FormAcademiqueRepository formAcademiqueRepository;
    private final FormateurRepository formateurRepository;
    private final SessionRepository sessionRepository;
    private final EvaluationFormateurRepository evaluationRepository;
    private final DemandeRepository demandeRepository;
    private final CommentsRepository commentsRepository;
    @Autowired
    private PresenceRepository presenceRepository;
    private final Faker faker = new Faker();


    @Override
    public Formateur Formateur(Long userId) {
        if (formateurRepository.findById(userId).isPresent()) {
            return formateurRepository.findById(userId).get();
        }
        return null;
    }

    @Override
    public Formateur UpdateFormateur(Long userId, Formateur formateurDetails) {
        return formateurRepository.findById(userId).map(p -> {
            p.setEmail(formateurDetails.getEmail());
            p.setFirstname(formateurDetails.getFirstname());
            p.setLastname(formateurDetails.getLastname());
            p.setImage(formateurDetails.getImage());
            p.setBio(formateurDetails.getBio());
            p.setCIN(formateurDetails.getCIN());
            p.setNaissance(formateurDetails.getNaissance());
            p.setRib(formateurDetails.getRib());
            p.setAdresse(formateurDetails.getAdresse());
            p.setTel(formateurDetails.getTel());
            p.setCompetance(formateurDetails.getCompetance());
            p.setComTech(formateurDetails.getComTech());
            p.setAutre(formateurDetails.getAutre());
//            p.setCv(formateurDetails.getCv());
//            p.setPortfolio(formateurDetails.getPortfolio());
//            p.setLinkedin(formateurDetails.getLinkedin());
            return formateurRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Formateur non trouve "));
    }

    public byte[] uploadFile(MultipartFile file) throws IOException {
        return file.getBytes();
    }

    public Formateur updateCv(Long userId, MultipartFile cvFile) throws IOException {
        return formateurRepository.findById(userId).map(formateur -> {
            try {
                formateur.setCv(cvFile.getBytes());
                return formateurRepository.save(formateur);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store CV", e);
            }
        }).orElseThrow(() -> new RuntimeException("Formateur not found"));
    }

    @Override
    public Formateur uploadCv(Long id, MultipartFile file) {
        return null;
    }

    @Override
    public Formateur UpdateAutre(Long userId, Formateur formateurDetails) {
        return formateurRepository.findById(userId).map(p -> {
//           updateCv(userId,formateurDetails.getCv());
            p.setPortfolio(formateurDetails.getPortfolio());
            p.setLinkedin(formateurDetails.getLinkedin());
            return formateurRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Formateur non trouve "));
    }
    @Override
    public ResponseEntity<byte[]> getCv(Long userId) {
        return formateurRepository.findById(userId)
                .map(formateur -> ResponseEntity.ok().body(formateur.getCv()))
                .orElseThrow(() -> new RuntimeException("Formateur non trouve"));
    }
    @Override
    public Cours addCourses(Cours cours, long id) {
        Formateur user = formateurRepository.findById(id).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }

        Cours course = new Cours();
        course.setFormateur(user);
        course.setNom(cours.getNom());
        course.setCours(cours.getCours());
        course.setTheme(cours.getTheme());
        course.setDescription(cours.getDescription());
        course.setDate_depo(new Date());

        return coursRepository.save(course);


    }

    @Override
    public List<Cours> coursByID(long id) {
        Optional<Formateur> user = formateurRepository.findById(id);
        if (user.isPresent()) {
            Formateur formateur = user.get();
            return formateur.getCours();
        } else {
            // Gérer le cas où le dossier n'est pas trouvé
            return Collections.emptyList();
        }
    }
    @Override
    public Cours UpdateCours(Long id, Cours cours) {
        return coursRepository.findById(id).map(course -> {
            course.setNom(cours.getNom());
            course.setCours(cours.getCours());
            course.setTheme(cours.getTheme());
            course.setDescription(cours.getDescription());
            course.setDate_depo(cours.getDate_depo());
            return coursRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Cours non trouve "));
    }
    @Override
    public FormAcademique UpdateForm(Long id, FormAcademique facad) {
        return formAcademiqueRepository.findById(id).map(course -> {
            course.setDiplome(facad.getDiplome());
            course.setSpecialite(facad.getSpecialite());
            course.setEtablissement(facad.getEtablissement());
            course.setDate(facad.getDate());
            course.setPreuve(facad.getPreuve());

            return formAcademiqueRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("certifications non trouve "));
    }
    @Override
    public ExprPro UpdateExpr(Long id, ExprPro exprr) {
        return exprProRepository.findById(id).map(course -> {
            course.setPoste(exprr.getPoste());
            course.setEntreprise(exprr.getEntreprise());
            course.setLieu(exprr.getLieu());
            course.setDebut(exprr.getDebut());
            course.setFin(exprr.getFin());
            course.setWorking(exprr.getWorking());

            return exprProRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("experience non trouve "));
    }
    @Override
    public String deleteformation(Long id) {
        formAcademiqueRepository.deleteById(id);
        return "formation supprimmer";
    }
    @Override
    public String deleteExperience(Long id) {
        exprProRepository.deleteById(id);
        return "expr supprimmer";
    }
    @Override
    public FormAcademique addForm(FormAcademique formAcademique, long id){
        Formateur user=formateurRepository.findById(id).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }

        FormAcademique formm=new FormAcademique();
        formm.setFormateur(user);
        formm.setDiplome(formAcademique.getDiplome());
        formm.setEtablissement(formAcademique.getEtablissement());
        formm.setSpecialite(formAcademique.getSpecialite());
        formm.setDate(formAcademique.getDate());
        formm.setPreuve(formAcademique.getPreuve());

        return formAcademiqueRepository.save(formm);

    }

    @Override
    public List<FormAcademique> Form(Long userId) {

        Optional<Formateur> user = formateurRepository.findById(userId);
        if (user.isPresent()) {
            Formateur formateur = user.get();
            return formateur.getFormAcademique();
        } else {
            // Gérer le cas où le dossier n'est pas trouvé
            return Collections.emptyList();
        }
    }

    @Override
    public FormAcademique FormationByid(Long id){
        return formAcademiqueRepository.findById(id).get();
    }

    @Override
    public ExprPro ExprByid(Long id){
        return exprProRepository.findById(id).get();
    }
    @Override
    public EvaluationFormateur eval(EvaluationFormateur eval, long userId,long sessionId){

        Formateur user=formateurRepository.findById(userId).orElse(null);
        Demande demande=demandeRepository.findById(sessionId).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        if (demande == null) {
            throw new IllegalArgumentException("Session not found with ID: " + sessionId);
        }

        EvaluationFormateur evaluation=new EvaluationFormateur();
        evaluation.setFormateur(user);
        evaluation.setDemande1(demande);
        evaluation.setQ1(eval.getQ1());
        evaluation.setQ2(eval.getQ2());
        evaluation.setQ3(eval.getQ3());
        evaluation.setQ4(eval.getQ4());
        evaluation.setQ5(eval.getQ5());



        return evaluationRepository.save(evaluation);

    }

    @Override
    public Demande postuler(Demande demande, long id) {
        Formateur user=formateurRepository.findById(id).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }

        Demande demande1=new Demande();
        demande1.setFormateur(user);
        demande1.setNbrSession(demande.getNbrSession());
        demande1.setTitre(demande.getTitre());
        demande1.setDescription(demande.getDescription());
        demande1.setDoc(demande.getDoc());
        demande1.setTitre(demande.getTitre());
        demande1.setTheme(demande.getTheme());
        demande1.setStatus("traitement");
        demande1.setCode(faker.regexify("[A-Z]{3}-[0-9]{4}"));
        demande1.setDate(new Date());


        return demandeRepository.save(demande1);
    }
    @Override
    public List<Demande> demandes(long id) {
        Optional<Formateur> user = formateurRepository.findById(id);
        if (user.isPresent()) {
            Formateur formateur = user.get();
            return formateur.getDemandes();
        } else {
            return Collections.emptyList();
        }
    }

    @Override
    public Demande demande(Long id) {
        if (demandeRepository.findById(id).isPresent()) {
            return demandeRepository.findById(id).get();
        }
        return null;
    }

    @Override
    public String deletedemande(Long id) {
        demandeRepository.deleteById(id);
        return "demande supprimmer";
    }
    @Override
    public List<Session> sessions(long id) {
        Optional<Demande> demande= demandeRepository.findById(id);
        if (demande.isPresent()) {
            Demande demande1 = demande.get();
            return demande1.getSessions();
        } else {
            // Gérer le cas où le dossier n'est pas trouvé
            return Collections.emptyList();
        }
    }

    @Override
    public List<Session> sessionsByFormateur(long id) {
        return sessionRepository.findAllByFormateurId(id);
    }

    @Override
    public Session sessionId(Long id) {
        if (sessionRepository.findById(id).isPresent()) {
            return sessionRepository.findById(id).get();
        }
        return null;
    }
    @Override
    public ExprPro expre(ExprPro exprPro, long id){
        Formateur user=formateurRepository.findById(id).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }

        ExprPro exp=new ExprPro();
        exp.setFormateur(user);
        exp.setPoste(exprPro.getPoste());
        exp.setEntreprise(exprPro.getEntreprise());
        exp.setLieu(exprPro.getLieu());
        exp.setDebut(exprPro.getDebut());
        exp.setFin(exprPro.getFin());
        exp.setWorking(exprPro.getWorking());

        return exprProRepository.save(exp);

    }

    @Override
    public List<ExprPro> expr(Long userId) {
        Optional<Formateur> user = formateurRepository.findById(userId);
        if (user.isPresent()) {
            Formateur formateur = user.get();
            return formateur.getExperiencePro();
        } else {
            // Gérer le cas où le dossier n'est pas trouvé
            return Collections.emptyList();
        }
    }

    @Override
    public Comments addComments(Comments comments, long userId, long id) {
        Formateur user=formateurRepository.findById(userId).orElse(null);
        Session session=sessionRepository.findById(id).orElse(null);

        if (user == null) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }

        Comments c=new Comments();
        c.setFormateur(user);
        c.setSession(session);
        c.setComment(comments.getComment());
        c.setDate(new Date());
        return commentsRepository.save(c);
    }

    @Override
    public List<Comments> comments(Long id) {
        Optional<Session> session = sessionRepository.findById(id);
        if (session.isPresent()) {
            Session session1 = session.get();
            return session1.getComments();
        } else {
            // Gérer le cas où le dossier n'est pas trouvé
            return Collections.emptyList();
        }
    }

    @Override
    public List<Demande> getDemandesByStatus() {
        return demandeRepository.findByStatus("proposer");
    }
    @Override
    public List<DemandeWithSessionsDTO> getSessionsGroupedByDemande() {
        List<Demande> demandes = demandeRepository.findByStatus("proposer");
//        logger.debug("Retrieved demandes: {}", demandes);

        List<DemandeWithSessionsDTO> result = new ArrayList<>();

        for (Demande demande : demandes) {
            List<Session> sessions = demande.getSessions();
//            logger.debug("Demande: {}, Sessions: {}", demande, sessions);
            result.add(new DemandeWithSessionsDTO(demande, sessions));
        }

//        logger.debug("Grouped Sessions DTO: {}", result);
        return result;
    }
    @Override
    @Transactional
    public void addFormateurToDemande(Long demandeId, Long formateurId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande not found"));
        Formateur formateur = formateurRepository.findById(formateurId)
                .orElseThrow(() -> new RuntimeException("Formateur not found"));

        if (!demande.getFormateurPropose().contains(formateur)) {
            demande.getFormateurPropose().add(formateur);
            demandeRepository.save(demande); // Save changes to the database
        }
    }

    @Override
    public void markPresence(Long formateurId, Long sessionId, boolean present) {
        List<Presence> presences = presenceRepository.findByFormateurIdAndSessionId(formateurId, sessionId);
        Presence presence;

        if (presences.isEmpty()) {
            presence = new Presence();
            presence.setFormateur(formateurRepository.findById(formateurId).orElseThrow(() -> new RuntimeException("Apprenant not found")));
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
    public boolean present(Long formateurId, Long sessionId) {
        List<Presence> presences = presenceRepository.findByFormateurIdAndSessionId(formateurId, sessionId);;
        return presences.stream().anyMatch(Presence::isPresent);
    }
    @Override
    public long getTotalSessionsForFormateur(long formateurId) {
        return sessionRepository.countByFormateurId(formateurId);
    }
    @Override
    public double getAverageApprenantsPerSession(long formateurId) {
        long totalSessions = sessionRepository.countByFormateurId(formateurId);
        long totalApprenants = demandeRepository.countApprenantsByFormateurId(formateurId);

        if (totalSessions == 0) {
            return 0;  // Avoid division by zero
        }

        return (int) Math.round((double) totalApprenants / totalSessions);
    }

    @Override
    public Map<String, Long> getFirstAndLastSessionIdsByDate(long demandeId) {
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeId);
        if (demandeOptional.isPresent()) {
            Demande demande = demandeOptional.get();
            List<Session> sessions = demande.getSessions();

            if (sessions.isEmpty()) {
                return Collections.emptyMap(); // Or handle this case as per your requirement
            }

            // Sort sessions by date
            sessions.sort(Comparator.comparing(Session::getDate));

            Session firstSession = sessions.get(0);
            Session lastSession = sessions.get(sessions.size() - 1);

            Map<String, Long> sessionIds = new HashMap<>();
            sessionIds.put("firstSessionId", firstSession.getId());
            sessionIds.put("lastSessionId", lastSession.getId());

            return sessionIds;
        }
        return Collections.emptyMap(); // Or handle this case as per your requirement
    }

}

