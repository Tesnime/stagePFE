package com.StagePFE.ReseauPro.Service.impl;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.Repository.*;
import com.StagePFE.ReseauPro.Service.AdminServices;
import com.StagePFE.ReseauPro.dio.DemandeWithFirstSessionDate;
import com.StagePFE.ReseauPro.dio.DemandeWithSessionsDTO;
import com.github.javafaker.Faker;
import com.itextpdf.forms.PdfAcroForm;
import com.itextpdf.forms.fields.PdfFormField;
import com.itextpdf.io.font.FontConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.Locale;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AdminServicesImpl implements AdminServices {

    private final CoursRepository coursRepository;
    private final ExprProRepository exprProRepository;
    private final FormAcademiqueRepository formAcademiqueRepository;
    private final FormateurRepository formateurRepository;
    private final SessionRepository sessionRepository;
    private final EvaluationApprenantRepository evaluationApprenantRepository;
    private final PresenceRepository presenceRepository;
    private final DemandeRepository demandeRepository;
    private final CommentsRepository commentsRepository;
    private final ApprenantRepository apprenantRepository;
    private final CertificationRepository certificationRepository;
    private final Faker faker = new Faker();
    @Override
    public List<Demande> demandes() {
        return demandeRepository.findAll();
    }
    @Override
    public List<Formateur> formateurs() {
        return formateurRepository.findAll();
    }
    @Override
    public List<Demande> demandesTerminer() {
        return demandeRepository.findByStatus("terminer");
    }
    public List<Demande> demandesAcceptes() {
        return demandeRepository.findByStatus("accept");
    }

    @Autowired
    private InteractionsRepositry interactionsRepositry;
    @Override
    public int demandesEnTraitement() {
        List<Demande> demandes = demandeRepository.findByStatus("traitement");
        return demandes.size();
    }
    @Override
    public List<Session> sessions() {
        return sessionRepository.findAll(Sort.by(Sort.Direction.ASC, "date"));
    }

    @Override
    public Demande demandeId(Long id) {
        return demandeRepository.findById(id).get();
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
    public List<Presence> presenceList(long sessionId){
        return presenceRepository.findBySessionId(sessionId);
    }
    @Override
    public int presencenbr(long sessionId){
        return presenceRepository.findBySessionIdAndPresent(sessionId,true).size();
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
    public Demande refus(Demande demande, long id) {
        return demandeRepository.findById(id).map(dem -> {
            dem.setStatus("refus");
            dem.setRaison(demande.getRaison());
            return demandeRepository.save(dem);
        }).orElseThrow(() -> new RuntimeException("demande non trouve "));
    }
    @Override
    public Demande accept( long id) {
        return demandeRepository.findById(id).map(dem -> {
            dem.setStatus("accept");

            return demandeRepository.save(dem);
        }).orElseThrow(() -> new RuntimeException("demande non trouve "));
    }
    @Override
    public Demande terminer(long id) {
        return demandeRepository.findById(id).map(dem -> {
            dem.setStatus("terminer");
            return demandeRepository.save(dem);
        }).orElseThrow(() -> new RuntimeException("demande non trouve "));
    }
    @Override
    public Session session(Session session, long demandeId){

        Demande demande=demandeRepository.findById(demandeId).orElse(null);

        if (demande == null) {
            throw new IllegalArgumentException("Session not found with ID: " + demandeId);
        }
        Session sess=new Session();
        sess.setDemande(demande);
        sess.setNom(session.getNom());
        Date existingDate = session.getDate();

        // Get the time part (hours, minutes, seconds) from session.getDebut()
        Date debutTime = session.getDebut();

        // Create a Calendar instance to manipulate the date and time
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(existingDate);

        // Set the time part (hours, minutes, seconds) from session.getDebut()
        calendar.set(Calendar.HOUR_OF_DAY, debutTime.getHours());
        calendar.set(Calendar.MINUTE, debutTime.getMinutes());
        calendar.set(Calendar.SECOND, debutTime.getSeconds());

        // Update the time part of sess.getDate()
        sess.setDate(calendar.getTime());;
        sess.setDebut(session.getDebut());
        sess.setFin(session.getFin());
        sess.setLieu(session.getLieu());
        return sessionRepository.save(sess);

    }

    @Override
    public Session updateSession(Session session, long id) {
        return sessionRepository.findById(id).map(sess -> {
            sess.setDate(session.getDate());
            sess.setDebut(session.getDebut());
            sess.setFin(session.getFin());

            return sessionRepository.save(sess);
        }).orElseThrow(() -> new RuntimeException("session non trouve "));
    }

    @Override
    public List<EvaluationApprenant> evaluationApprenantList(long id){
        Optional<Demande> demandeOptional = demandeRepository.findById(id);
        if (demandeOptional.isEmpty()) {
            throw new RuntimeException("Demande not found for id " + id);
        }

        List<EvaluationApprenant> evaluations = demandeOptional.get().getEvaluationApprenants();
        if (evaluations.isEmpty()) {
            throw new RuntimeException("No evaluations found for demande id " + id);
        }
        return evaluations;
    }
    @Override
    public Map<String, Map<String, Long>> getStatistics(long id) {

    Optional<Demande> demandeOptional = demandeRepository.findById(id);
    if (demandeOptional.isEmpty()) {
        throw new RuntimeException("Demande not found for id " + id);
    }

    List<EvaluationApprenant> evaluations = demandeOptional.get().getEvaluationApprenants();
    if (evaluations.isEmpty()) {
        throw new RuntimeException("No evaluations found for demande id " + id);
    }

    return calculateStatistics(evaluations);
    }

    @Override
    public Double getStar(long demandeID) {
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeID);
        if (demandeOptional.isPresent()) {
            List<EvaluationApprenant> evaluations = demandeOptional.get().getEvaluationApprenants();
            if (evaluations.isEmpty()) {
                return 0.0;
            }

            double sumStars = evaluations.stream().mapToInt(EvaluationApprenant::getStar).sum();
            double average = sumStars / evaluations.size();

            // Round to 2 decimal places
            BigDecimal bd = new BigDecimal(Double.toString(average));
            bd = bd.setScale(2, RoundingMode.HALF_UP);
            return bd.doubleValue();
        } else {
            throw new EntityNotFoundException("Demande not found with ID: " + demandeID);
        }
    }
    @Override
    public Map<String, Integer> getStat() {

        int apprenant=apprenantRepository.findAll().size();
        int formateur=formateurRepository.findAll().size();
        int session=sessionRepository.findAll().size();

        Map<String, Integer> tot = new HashMap<>();

        tot.put("apprenant", apprenant);
        tot.put("formateur",formateur);
        tot.put("session", session);


        return tot;
    }

    @Override
    public Presence getApprenantStat(Long apprenantId, Long sessionId) {

        return presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId).get(0);

    }

    private Map<String, Map<String, Long>> calculateStatistics(List<EvaluationApprenant> evaluations) {
        Map<String, Map<String, Long>> statistics = new HashMap<>();

        statistics.put("q1", getResponseCounts(evaluations, EvaluationApprenant::getQ1));
        statistics.put("q2", getResponseCounts(evaluations, EvaluationApprenant::getQ2));
        statistics.put("q3", getResponseCounts(evaluations, EvaluationApprenant::getQ3));
        statistics.put("q4", getResponseCounts(evaluations, EvaluationApprenant::getQ4));
        statistics.put("q5", getResponseCounts(evaluations, EvaluationApprenant::getQ5));
        statistics.put("q6", getResponseCounts(evaluations, EvaluationApprenant::getQ6));


//        for (Map<String, Long> questionMap : statistics.values()) {
//            long totalCount = questionMap.values().stream().mapToLong(Long::longValue).sum();
//            for (Map.Entry<String, Long> entry : questionMap.entrySet()) {
//                long count = entry.getValue();
//                double percentage = (count * 100.0) / totalCount;
//                entry.setValue(Math.round(percentage));
//            }
//        }
        return statistics;
    }

    private Map<String, Long> getResponseCounts(List<EvaluationApprenant> evaluations, Function<EvaluationApprenant, String> responseGetter) {
        return evaluations.stream()
                .collect(Collectors.groupingBy(responseGetter, Collectors.counting()));
    }
    @Override
    public List<Object[]> getAllInteractionsGroupedByInterests() {
        Pageable pageable = PageRequest.of(0, 6);
        return interactionsRepositry.findAllGroupedByCentreInteret(pageable );
    }

    @Override
    public List<Object[]> getAllInteractionsGroupedByDifficultes() {

        Pageable pageable = PageRequest.of(0, 6);
        return interactionsRepositry.findAllGroupedByDifficultes(pageable );
    }
    @Override
    public double calculatePresenceRate(long sessionId) {
        long totalApprenants = presenceRepository.countBySessionId(sessionId);
        long presentApprenants = presenceRepository.countBySessionIdAndPresentTrue(sessionId);

        if (totalApprenants == 0) {
            return 0;  // Avoid division by zero
        }

        return (double) presentApprenants / totalApprenants * 100;
    }
    @Override
    public double calculateOverallPresenceRateByFormateur() {
        List<Session> sessions = sessionRepository.findAll();

        long totalApprenants = 0;
        long totalPresentApprenants = 0;

        for (Session session : sessions) {
            totalApprenants += presenceRepository.countBySessionId(session.getId());
            totalPresentApprenants += presenceRepository.countBySessionIdAndPresentTrue(session.getId());
        }

        return (totalApprenants == 0) ? 0 : (double) totalPresentApprenants / totalApprenants * 100;
    }

    @Override
    public Demande ajoutFormation(Demande demande) {
        Demande demande1 = new Demande();
        demande1.setTitre(demande.getTitre());
        demande1.setDescription(demande.getDescription());
        demande1.setDoc(demande.getDoc());
        demande1.setTheme(demande.getTheme());
        demande1.setStatus("proposer");
        demande1.setCode(faker.regexify("[A-Z]{3}-[0-9]{4}"));
        demande1.setDate(new Date());

        demandeRepository.save(demande1);


        return demande1;
    }
    @Override
    public Demande updateDemande(Long id, Demande demandeDetails) {
        Optional<Demande> optionalDemande = demandeRepository.findById(id);

        if (optionalDemande.isPresent()) {
            Demande existingDemande = optionalDemande.get();

            existingDemande.setTheme(demandeDetails.getTheme());
            existingDemande.setTitre(demandeDetails.getTitre());
            existingDemande.setDescription(demandeDetails.getDescription());
            existingDemande.setDoc(demandeDetails.getDoc());


            return demandeRepository.save(existingDemande);
        } else {
            throw new RuntimeException("Demande not found with id: " + id);
        }
    }
    @Override
    public Demande addFormateurToDemande(Long demandeId, Long formateurId) {
        // Retrieve the Demande by ID
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeId);
        if (!demandeOptional.isPresent()) {
            throw new RuntimeException("Demande not found with id: " + demandeId);
        }
        Demande demande = demandeOptional.get();

        // Retrieve the Formateur by ID
        Optional<Formateur> formateurOptional = formateurRepository.findById(formateurId);
        if (!formateurOptional.isPresent()) {
            throw new RuntimeException("Formateur not found with id: " + formateurId);
        }
        Formateur formateur = formateurOptional.get();

        // Add the Formateur to the formateurPropose list
        demande.setFormateur(formateur);
        demande.setStatus("accept");

        // Save the updated Demande entity
        return demandeRepository.save(demande);
    }
    @Override
    public ResponseEntity<String> storeFile(MultipartFile file) {
        try {
            Certification uploadedFile = new Certification();
            uploadedFile.setFileName(file.getOriginalFilename());
            uploadedFile.setData(file.getBytes());
            certificationRepository.save(uploadedFile);
            return ResponseEntity.ok("File uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public  List<Certification> getCertificate(){
        return certificationRepository.findByApprenantIsNullAndDemandeIsNull();
    }
    @Override
    public byte[] modifyPdf(Long certId, Long demandeId) throws IOException {
        Optional<Certification> certOptional = certificationRepository.findById(certId);
        Optional<Demande> demandeOptional = demandeRepository.findById(demandeId);

        if (certOptional.isPresent() && demandeOptional.isPresent()) {
            Certification cert = certOptional.get();
            Demande demande = demandeOptional.get();
            byte[] pdfData = cert.getData();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfDocument pdfDoc = new PdfDocument(new PdfReader(new ByteArrayInputStream(pdfData)), new PdfWriter(baos));
            PdfAcroForm form = PdfAcroForm.getAcroForm(pdfDoc, true);

            if (form != null) {
                Map<String, PdfFormField> fields = form.getFormFields();
                System.out.println("Available fields in the PDF:");
                for (String key : fields.keySet()) {
                    System.out.println("Field name: " + key);
                }

                // Modify fields with the data from Demande
                PdfFormField nameField = fields.get("titre");
                if (nameField != null) {
                    nameField.setFont(PdfFontFactory.createFont(FontConstants.TIMES_BOLDITALIC));
                    nameField.setFontSize(35);
                    nameField.setValue(demande.getTitre());
                } else {
                    System.err.println("Field 'nameField' not found in the PDF");
                }

                PdfFormField dateField = fields.get("date");
                if (dateField != null) {
                    LocalDate localDate = demande.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    // Formatter la date dans le format souhaité
                    String formattedDate = localDate.format(DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH));
                    nameField.setFont(PdfFontFactory.createFont(FontConstants.TIMES_BOLDITALIC));
                    nameField.setFontSize(30);
                    dateField.setValue(formattedDate.toString());
                } else {
                    System.err.println("Field 'dateField' not found in the PDF");
                }

                // Add more fields as needed
            } else {
                System.err.println("PDF form not found");
            }

            pdfDoc.close();


            return baos.toByteArray();
        } else {
            throw new IOException("Certificate or Demande not found");
        }
    }
    @Override
    public byte[] modifyPdfName(Long certId, Long apprenantId) throws IOException {
        Optional<Certification> certOptional = certificationRepository.findById(certId);
        Optional<Apprenant> demandeOptional = apprenantRepository.findById(apprenantId);


        if (certOptional.isPresent() && demandeOptional.isPresent()) {
            Certification cert = certOptional.get();
            Apprenant demande = demandeOptional.get();
            byte[] pdfData = cert.getData();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfDocument pdfDoc = new PdfDocument(new PdfReader(new ByteArrayInputStream(pdfData)), new PdfWriter(baos));
            PdfAcroForm form = PdfAcroForm.getAcroForm(pdfDoc, true);

            if (form != null) {
                Map<String, PdfFormField> fields = form.getFormFields();
                System.out.println("Available fields in the PDF:");
                for (String key : fields.keySet()) {
                    System.out.println("Field name: " + key);
                }

                // Modify fields with the data from Demande
                PdfFormField nameField = fields.get("name");
                if (nameField != null) {
                    nameField.setFont(PdfFontFactory.createFont(FontConstants.TIMES_BOLDITALIC));
                    nameField.setFontSize(35);
                    nameField.setValue("Mr/Mmme "+demande.getFirstname()+" "+demande.getLastname()+" Cin="+demande.getCin());
                } else {
                    System.err.println("Field 'nameField' not found in the PDF");
                }

                PdfFormField dateField = fields.get("jour");
                if (dateField != null) {

                    String formattedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH));
                    nameField.setFont(PdfFontFactory.createFont(FontConstants.TIMES_BOLDITALIC));
                    nameField.setFontSize(30);
                    dateField.setValue("Fait a tunis,le"+formattedDate.toString());
                } else {
                    System.err.println("Field 'dateField' not found in the PDF");
                }

                // Add more fields as needed
            } else {
                System.err.println("PDF form not found");
            }

            pdfDoc.close();

            return baos.toByteArray();
        } else {
            throw new IOException("Certificate or Demande not found");
        }
    }
    @Override
    public ResponseEntity<String> modifyCertificate(Long certId, long demandeId) {
        try {
            byte[] modifiedPdf = modifyPdf(certId, demandeId);
            Optional<Certification> certOptional = certificationRepository.findById(certId);
            Demande demande = demandeRepository.findById(demandeId).orElse(null); // Get demande or null

            if (certOptional.isPresent() && demande != null) {
                Certification originalCert = certOptional.get();
                Certification newCert = new Certification();
                newCert.setFileName("attestation de "+demande.getTitre());
                newCert.setData(modifiedPdf);
                newCert.setDemande(demande);

                certificationRepository.save(newCert);
                System.out.println("Success");
                return ResponseEntity.ok().body("Success");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Certificate or Demande not found");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error");
        }
    }

    @Override
    public ResponseEntity<String> modifyCertificateApprenant(Long certId, long apprenantId) {
        try {
            byte[] modifiedPdf = modifyPdfName(certId, apprenantId);
            Optional<Certification> certOptional = certificationRepository.findById(certId);
            Apprenant apprenant = apprenantRepository.findById(apprenantId).orElse(null); // Get apprenant or null

            if (certOptional.isPresent() && apprenant != null) {
                Certification originalCert = certOptional.get();
                Certification newCert = new Certification();
                newCert.setFileName(originalCert.getFileName());
                newCert.setData(modifiedPdf);
                newCert.setDemande(originalCert.getDemande());
                newCert.setApprenant(apprenant);

                certificationRepository.save(newCert);
                return ResponseEntity.ok().body("Success");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Certificate or Apprenant not found");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error");
        }
    }
    @Override
    public Optional<Session> getFirstSessionByFormateur(long formateurId) {
        List<Session> sessions = sessionRepository.findByFormateurOrderByDateAsc(formateurId);
        return sessions.stream().findFirst();
    }
//    @Override
//    public Map<Demande, Date> getDemandesByFormateurId(long id) {
//        Optional<Formateur> formateurOptional = formateurRepository.findById(id);
//        if (formateurOptional.isPresent()) {
//            Formateur formateur = formateurOptional.get();
//            Map<Demande, Date> demandeDateMap = new HashMap<>();
//            for (Demande demande : formateur.getDemandes()) {
//                List<Session> sessions = sessionRepository.findByDemandeId(demande.getId());
//                Session firstSession = sessions.get(0);
//                Date firstSessionDate=firstSession.getDate();
//                demandeDateMap.put(demande, firstSessionDate);
//            }
//            return demandeDateMap;
//        } else {
//            // Handle the case where the Formateur is not found
//            return Collections.emptyMap();
//        }
//    }

//    @Override
//    public Map<Demande, Date> getDemandesByFormateurId(long id) {
//        Optional<Formateur> formateurOptional = formateurRepository.findById(id);
//        if (formateurOptional.isPresent()) {
//            Formateur formateur = formateurOptional.get();
//            Map<Demande, Date> demandeDateMap = new HashMap<>();
//            for (Demande demande : formateur.getDemandes()) {
//                if (!"traitement".equalsIgnoreCase(demande.getStatus()) &&
//                        !"Refus".equalsIgnoreCase(demande.getStatus()) &&
//                        !"refus".equalsIgnoreCase(demande.getStatus())) {
//                    List<Session> sessions = sessionRepository.findByDemandeId(demande.getId());
//                    Session firstSession = sessions.get(0);
//                    Date firstSessionDate = firstSession.getDate();
//                    demandeDateMap.put(demande, firstSessionDate);
//                    System.out.println(demandeDateMap);
//
//                }
//            }
//            return demandeDateMap;
//        } else {
//            // Handle the case where the Formateur is not found
//            // Log a warning or throw an appropriate exception
//            System.out.println("Formateur with ID: " + id + " not found.");
//            return Collections.emptyMap();
//        }
//    }

//    @Override
//    public Map<Demande, List<Session>> getSessionsGroupedByDemande() {
//        List<Demande> demandes = demandeRepository.findAll();
//
//        // Group sessions by demande
//        Map<Demande, List<Session>> groupedSessions = new HashMap<>();
//
//        for (Demande demande : demandes) {
//            groupedSessions.put(demande, demande.getSessions());
//        }
//
//        return groupedSessions;
//    }

    @Override
    public List<DemandeWithSessionsDTO> getSessionsGroupedByDemande() {
        List<Demande> demandes = demandeRepository.findAll();
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
    public List<Session> example(long id) {
        Optional<Demande> sessions = demandeRepository.findById(id);
        return sessions.get().getSessions();
    }

    @Override
    public List<DemandeWithFirstSessionDate> getDemandesByFormateurId(long id) {
        Optional<Formateur> formateurOptional = formateurRepository.findById(id);

        if (formateurOptional.isPresent()) {
            Formateur formateur = formateurOptional.get();

            return formateur.getDemandes().stream()
                    .filter(demande -> !"traitement".equalsIgnoreCase(demande.getStatus()) &&
                            !"Refus".equalsIgnoreCase(demande.getStatus()) &&
                            !"refus".equalsIgnoreCase(demande.getStatus()))
                    .flatMap(demande -> {
                        List<Session> sessions = sessionRepository.findByDemandeId(demande.getId());

                        if (sessions.isEmpty()) {
                            // Handle case where there are no sessions for the demande
                            System.out.println("No sessions found for demande with ID: " + demande.getId());
                            return Stream.empty(); // or handle it as needed
                        }

                        Session firstSession = sessions.get(0);
                        Date firstSessionDate = firstSession.getDate();

                        DemandeWithFirstSessionDate demandeWithFirstSessionDate = new DemandeWithFirstSessionDate();
                        demandeWithFirstSessionDate.setDemande(demande);
                        demandeWithFirstSessionDate.setFirstSessionDate(firstSessionDate);
                        demandeWithFirstSessionDate.setNbJours(sessions.size());

                        return Stream.of(demandeWithFirstSessionDate);
                    })
                    .collect(Collectors.toList());
        } else {
            // Handle the case where the Formateur is not found
            System.out.println("Formateur with ID: " + id + " not found.");
            return Collections.emptyList();
        }
    }
    @Override
    public Map<String, Double> calculateThemePercentages(long formateurId) {
        Optional<Formateur> formateurOptional = formateurRepository.findById(formateurId);

        Formateur formateur = formateurOptional.get();
        List<Demande> demandes = formateur.getDemandes().stream()
                .filter(demande -> !("traitement".equalsIgnoreCase(demande.getStatus()) ||
                        "Refus".equalsIgnoreCase(demande.getStatus())))
                .collect(Collectors.toList());

        Map<String, Integer> themeCounts = new HashMap<>();
        int totalThemes = 0;

        // Count the occurrences of each theme
        for (Demande demande : demandes) {
            for (String theme : demande.getTheme()) {
                String normalizedTheme = theme.toLowerCase();
                themeCounts.put(normalizedTheme, themeCounts.getOrDefault(normalizedTheme, 0) + 1);
                totalThemes++;
            }
        }

        // Calculate the percentages
        Map<String, Double> themePercentages = new HashMap<>();
        for (Map.Entry<String, Integer> entry : themeCounts.entrySet()) {
            double percentage = (entry.getValue() * 100.0) / totalThemes;
            themePercentages.put(entry.getKey(), percentage);
        }

        return themePercentages;
    }
    @Override
    public Map<String, Double> calculatePercentagesForFormateur(long formateurId) {
        long totalDemandes = demandeRepository.countAllDemandesByFormateurId(formateurId);
        Map<String, Double> percentages = new HashMap<>();

        if (totalDemandes == 0) {
            percentages.put("RefusPercentage", 0.0);
            percentages.put("TerminerAndAcceptPercentage", 0.0);
            return percentages;
        }

        long refusCount = demandeRepository.countByStatusRefusAndFormateurId(formateurId);
        long terminerCount = demandeRepository.countByStatusTerminerAndFormateurId(formateurId);
        long acceptCount = demandeRepository.countByStatusAcceptAndFormateurId(formateurId);
        long combinedCount = terminerCount + acceptCount;

        double Demande_refusée = (double) refusCount / totalDemandes * 100;
        double Demande_faite = (double) combinedCount / totalDemandes * 100;

        percentages.put("demande refusée",Demande_refusée );
        percentages.put("session faite", Demande_faite);

        return percentages;
    }
    @Override
    public double calculatePresenceRateByFormateur(long formateurId) {
        Optional<Formateur> formateurOptional = formateurRepository.findById(formateurId);
        if (formateurOptional.isPresent()) {
            Formateur formateur = formateurOptional.get();
            List<Demande> demandes =formateur.getDemandes().stream()
                    .filter(demande -> !"traitement".equalsIgnoreCase(demande.getStatus()) &&
                            !"Refus".equalsIgnoreCase(demande.getStatus()) &&
                            !"refus".equalsIgnoreCase(demande.getStatus()))
                    .collect(Collectors.toList());

            int totalSessions = 0;
            int totalPresences = 0;
            int n=0;

            for (Demande demande : demandes) {
                List<Session> sessions = demande.getSessions();
                totalSessions += demande.getApprenants().size();
                System.out.println("tot "+totalSessions);


                for (Session session : sessions) {
                    List<Presence> presences = session.getPresences();
                    for (Presence presence : presences) {
                        if (presence.isPresent()) {
                            System.out.println(n);
                            totalPresences++;
                        }
                    }
                }
            }

            if (totalSessions > 0) {
                return (double)  (totalPresences) / totalSessions * 100;
            }
        }
        return 0.0;
    }

    @Override
    public double calculateStarRateByFormateur(long formateurId) {
        Optional<Formateur> formateurOptional = formateurRepository.findById(formateurId);
        int totalStars = 0;
        int totalEvaluations = 0;

        if (formateurOptional.isPresent()) {
            Formateur formateur = formateurOptional.get();
            List<Demande> demandes = formateur.getDemandes().stream()
                    .filter(demande -> !"traitement".equalsIgnoreCase(demande.getStatus()) &&
                            !"Refus".equalsIgnoreCase(demande.getStatus()) &&
                            !"refus".equalsIgnoreCase(demande.getStatus()))
                    .collect(Collectors.toList());

            for (Demande demande : demandes) {
                List<EvaluationApprenant> evaluationApprenants = demande.getEvaluationApprenants();
                for (EvaluationApprenant eval : evaluationApprenants) {
                    totalStars += eval.getStar();
                    totalEvaluations++;
                }
            }

            if (totalEvaluations > 0) {
                return (double) totalStars / totalEvaluations;
            }
        }

        return 0.0;
    }
    @Override
    public Map<String, Map<String, Double>> calculateResponseDistributionsByFormateur(long formateurId) {
        Optional<Formateur> formateurOptional = formateurRepository.findById(formateurId);
        Map<String, Map<String, Double>> responseDistributions = new HashMap<>();

        if (formateurOptional.isPresent()) {
            Formateur formateur = formateurOptional.get();
            List<Demande> demandes = formateur.getDemandes();

            // Initialize response counts
            Map<String, Map<String, Integer>> responseCounts = new HashMap<>();
            responseCounts.put("q1", new HashMap<>());
            responseCounts.put("q2", new HashMap<>());
            responseCounts.put("q3", new HashMap<>());
            responseCounts.put("q4", new HashMap<>());
            responseCounts.put("q5", new HashMap<>());
            responseCounts.put("q6", new HashMap<>());

            int totalResponses = 0;

            for (Demande demande : demandes) {
                List<EvaluationApprenant> evaluationApprenants = demande.getEvaluationApprenants();
                for (EvaluationApprenant eval : evaluationApprenants) {
                    countResponse(responseCounts.get("q1"), eval.getQ1());
                    countResponse(responseCounts.get("q2"), eval.getQ2());
                    countResponse(responseCounts.get("q3"), eval.getQ3());
                    countResponse(responseCounts.get("q4"), eval.getQ4());
                    countResponse(responseCounts.get("q5"), eval.getQ5());
                    countResponse(responseCounts.get("q6"), eval.getQ6());
                    totalResponses++;
                }
            }

            // Calculate percentages
            for (Map.Entry<String, Map<String, Integer>> entry : responseCounts.entrySet()) {
                String question = entry.getKey();
                Map<String, Integer> counts = entry.getValue();
                Map<String, Double> percentages = new HashMap<>();

                int totalForQuestion = counts.values().stream().mapToInt(Integer::intValue).sum();
                for (Map.Entry<String, Integer> countEntry : counts.entrySet()) {
                    String response = countEntry.getKey();
                    int count = countEntry.getValue();
                    double percentage = (totalForQuestion > 0) ? (double) count / totalForQuestion * 100 : 0.0;
                    percentages.put(response, percentage);
                }

                responseDistributions.put(question, percentages);
            }
        }

        return responseDistributions;
    }

    private void countResponse(Map<String, Integer> counts, String response) {
        if (response != null) {
            counts.put(response, counts.getOrDefault(response, 0) + 1);
        }
    }
    @Override
    public Map<String, Double> calculateAllDemandeThemePercentages() {
        List<Demande> demandes = demandeRepository.findAll();

        // Aggregate all themes
        List<String> allThemes = new ArrayList<>();
        for (Demande demande : demandes) {
            allThemes.addAll(demande.getTheme());
        }

        // Check if there are themes to avoid division by zero
        if (allThemes.isEmpty()) {
            return Collections.emptyMap();
        }

        int totalThemes = allThemes.size();

        // Normalize themes to lower case and count occurrences
        Map<String, Long> themeCounts = allThemes.stream()
                .collect(Collectors.groupingBy(String::toLowerCase, Collectors.counting()));

        // Calculate percentages
        Map<String, Double> themePercentages = new HashMap<>();
        for (Map.Entry<String, Long> entry : themeCounts.entrySet()) {
            double percentage = (entry.getValue() * 100.0) / totalThemes;
            themePercentages.put(entry.getKey(), percentage);
        }
        // Sort by percentages in descending order
        Map<String, Double> sortedThemePercentages = themePercentages.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));

        return sortedThemePercentages;
    }

    @Override
    public List<Presence> findPresence(long apprenantId, long sessionId) {
        return presenceRepository.findByApprenantIdAndSessionId(apprenantId, sessionId);
    }
    @Override
    public List<Presence> findFormateurPresence(long formateurId, long sessionId) {
        return presenceRepository.findByFormateurIdAndSessionId(formateurId, sessionId);
    }
    @Override
    public List<Session> sessionsByDemande( long demandeId) {
        Optional<Demande> demande=demandeRepository.findById(demandeId);
        return demande.get().getSessions();
    }

    @Override
    public void deleteSessionById(Long id) {
        Optional<Session> session = sessionRepository.findById(id);

        if (session.isPresent()) {
            sessionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Session not found with id: " + id);
        }
    }

}








