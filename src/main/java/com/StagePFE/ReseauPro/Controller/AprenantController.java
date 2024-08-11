package com.StagePFE.ReseauPro.Controller;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.Repository.ApprenantRepository;
import com.StagePFE.ReseauPro.Repository.CertificationRepository;
import com.StagePFE.ReseauPro.Repository.FormateurRepository;
import com.StagePFE.ReseauPro.Service.AdminServices;
import com.StagePFE.ReseauPro.Service.ApprenantServices;
import com.StagePFE.ReseauPro.Service.FormateurServices;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/apprenant")
@RequiredArgsConstructor
public class AprenantController {

    private final ApprenantServices apprenantServices;
    private final FormateurServices formateurServices ;
    private final CertificationRepository certificationRepository;
    private final ApprenantRepository apprenantRepository;
    private final AdminServices adminServices ;
    private final FormateurRepository formateurRepository;


    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Hi Apprenant!");
    }

    @PostMapping("/apprenant")
    public Apprenant profile(@RequestParam Long userId, @RequestBody Apprenant apprenantDetails){
        return apprenantServices.UpdateApprenant(userId,apprenantDetails);
    }
    @GetMapping("/getApprenant")
    public Apprenant apprenatById(@RequestParam Long userId){
        return apprenantServices.apprenant(userId);
    }

    @GetMapping("/apprenants")
    public List<Apprenant> apprenats(@RequestParam Long id){
        return apprenantServices.getApprenantsByDemandeId(id);
    }

    @GetMapping("demandesByApp")
    public List<Demande> getDemandesByApprenant(@RequestParam Long id) {
        return apprenantServices.getDemandesByApprenantId(id);
    }

    @GetMapping("sessionByDemandde")
    public List<Session> getSessions(@RequestParam Long id) {
        return apprenantServices.getSessionsByDemandeId(id);
    }
    @PostMapping("/postuler")
    public void postuler( @RequestParam long id,@RequestParam String code){
        apprenantServices.addApprenantToDemande(id, code);
    }
    @PostMapping("/{sessionId}/evaluation")
    public EvaluationApprenant eval(@RequestBody EvaluationApprenant evaluation, @RequestParam long userId, @PathVariable long sessionId){
        return apprenantServices.eval(evaluation,userId,sessionId);
    }
    @PostMapping("/{sessionId}/star")
    public EvaluationApprenant evalStar(@RequestParam int evaluation, @RequestParam long userId, @PathVariable long sessionId){
        return apprenantServices.evalStar(evaluation,userId,sessionId);
    }
    @GetMapping("/sessions")
    public ResponseEntity<List<Session>> getSessionsByApprenantId(@RequestParam long id) {
        List<Session> sessions = apprenantServices.getSessionsByApprenantId(id);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessionsDate")
    public ResponseEntity<List<Session>> getSessionsByApprenantIdDate(@RequestParam long id) {
        List<Session> sessions = apprenantServices.getCurrentSessionsByApprenantId(id);
        return ResponseEntity.ok(sessions);
    }
    @GetMapping("/comments")
    public List<Comments> comments(@RequestParam long id){
        return formateurServices.comments(id);
    }
    @PostMapping("/{sessionId}/addComment")
    public Comments addComment(@RequestBody Comments commentDetails, @RequestParam long userId,@PathVariable long sessionId){
        return apprenantServices.addComments(commentDetails,userId,sessionId);
    }
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendVerificationEmail(
            @RequestParam String email,
            @RequestParam String nom,
            @RequestParam String code) throws MessagingException {
        apprenantServices.sendVerificationEmail(email, code, nom);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Verification code sent to " + email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/codeConfirm")
    public Apprenant code(@RequestParam Long userId, @RequestParam String code){
        return apprenantServices.code(userId,code);
    }

    @PostMapping("/presence")
    public ResponseEntity<Void> markPresence(@RequestParam Long apprenantId, @RequestParam Long sessionId, @RequestParam boolean present) {
        apprenantServices.markPresence(apprenantId, sessionId, present);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/donnee")
    public ResponseEntity<Void> m(@RequestParam Long apprenantId, @RequestParam Long sessionId, @RequestBody Presence present) {
        apprenantServices.donnee(apprenantId, sessionId, present);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/ajoutPresent")
    public ResponseEntity<Void> fauxPresent(@RequestParam String code, @RequestParam Long apprenantId) {
        apprenantServices.ajoutPresent(code, apprenantId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/isPresent")
    public boolean isApprenantPresent(@RequestParam Long apprenantId, @RequestParam Long sessionId) {
        return apprenantServices.present(apprenantId, sessionId);
    }
    @GetMapping("/donneee")
    public Presence isApp(@RequestParam Long apprenantId, @RequestParam Long sessionId) {
        return apprenantServices.donnee(apprenantId, sessionId);
    }
    @PostMapping("/certificate/modify/{certId}/{demandeId}")
    public ResponseEntity<String> modifyCertificate(@PathVariable Long certId, @PathVariable Long demandeId) {
        return adminServices.modifyCertificate(certId, demandeId);
    }
    @PostMapping("/certificate/modifyApp/{certId}/{apprenantId}")
    public ResponseEntity<String> modifyCertificateApprenant(@PathVariable Long certId, @PathVariable Long apprenantId) {
        return adminServices.modifyCertificateApprenant(certId, apprenantId);
    }
    @GetMapping("/certificate/{id}")
    public ResponseEntity<byte[]> getCertificate(@PathVariable Long id) {
        Optional<Certification> certOptional = certificationRepository.findById(id);
        if (certOptional.isPresent()) {
            Certification cert = certOptional.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(cert.getData());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/certif/{apprenantId}/demande/{demandeId}")
    public ResponseEntity<List<Certification>> getCertificationsByDemandeId(@PathVariable Long apprenantId, @PathVariable Long demandeId) {
        List<Certification> certifications = apprenantServices.getCertificationsByDemandeId(apprenantId, demandeId);
        if (certifications.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(certifications);
        }
    }

    @PostMapping("/{id}/upload")
    public String uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return "File is empty";
        }

        // Convertir le fichier en tableau de bytes
        byte[] imageBytes = file.getBytes();

        // Enregistrer l'image dans la base de données
        Optional<Apprenant> optionalUser = apprenantRepository.findById(id);
        if (optionalUser.isPresent()) {
            Apprenant user = optionalUser.get();
            user.setImage(imageBytes);
            apprenantRepository.save(user);
            return "File uploaded successfully";
        } else {
            return "User not found";
        }
    }
    @GetMapping("/{id}/image")
    public byte[] getImage(@PathVariable Long id) {
        Optional<Apprenant> optionalUser = apprenantRepository.findById(id);
        if (optionalUser.isPresent()) {
            return optionalUser.get().getImage();
        } else {
            throw new RuntimeException("User not found");
        }
    }
    @GetMapping("/{id}/imageFormateur")
    public byte[] getFormateurImage(@PathVariable Long id) {
        Optional<Formateur> optionalUser = formateurRepository.findById(id);
        if (optionalUser.isPresent()) {
            return optionalUser.get().getImage();
        } else {
            throw new RuntimeException("User not found");
        }
    }
    @GetMapping("/fistLastSession")
    public Map<String, Long> getFirstAndLAstSession(@RequestParam long demandeId){
        return formateurServices.getFirstAndLastSessionIdsByDate(demandeId);
    }

    @GetMapping("/PresenceByDemande/{demandeId}")
    public List<Presence> getFirstAndLAstSession(@RequestParam long apprenantId,@PathVariable long demandeId){
        return apprenantServices.getPresenceForApprenantInDemande(apprenantId,demandeId);
    }

    @GetMapping("/demandeId")
    public long getDemandeId(@RequestParam String code){
        return apprenantServices.demandIdByCode(code);
    }
    @PostMapping("/sendConfirmation")
    public ResponseEntity<Map<String, String>> sendInscriptionEmail(
            @RequestParam String email,
            @RequestParam String nom,
            @RequestParam long demandeId) throws MessagingException {
        apprenantServices.sendInscriptionEmail(email,nom,demandeId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "confirmation sent to " + email);
        return ResponseEntity.ok(response);
    }
    @PostMapping("addTache")
    public Taches addTache(@RequestParam Long id, @RequestParam String tache) {
        return apprenantServices.addTache(tache,id);
    }
    @DeleteMapping("deleteTache")
    public void deleteTask(@RequestParam Long id) {
        apprenantServices.deleteTask(id);
    }
    @GetMapping("/tacheByApprenant")
    public List<Taches> getTachesByApprenantId(@RequestParam long apprenantId) {
        return apprenantServices.getTachesByApprenantId(apprenantId);
    }
    @PostMapping("/sendQuestion")
    public ResponseEntity<Questions> addQuestion(@RequestBody Questions question,@RequestParam long id) {
        Questions savedQuestion = apprenantServices.addQuestion(question,id);
        return ResponseEntity.ok(savedQuestion);
    }
    @GetMapping("/allQuestions")
    public List<Questions> getAllQuestions(){
        return apprenantServices.getAllQuestion();
    }

    @GetMapping("/mesQuestions")
    public List<Questions> getQuestionsByApprenantId(@RequestParam long apprenantId) {
        return apprenantServices.getQuestionsByApprenantId(apprenantId);
    }
    @PostMapping("/answer")
    public Answers addAnswer(
            @RequestParam Long apprenantId,
            @RequestParam Long questionId,
            @RequestBody Answers answerDetails) {
        return apprenantServices.addAnswer(apprenantId, questionId, answerDetails);
    }
    @PutMapping("/updateAnswer")
    public ResponseEntity<Answers> updateAnswer(@RequestParam Long id, @RequestBody Answers answerDetails) {
        Answers updatedAnswer = apprenantServices.updateAnswer(id, answerDetails);
        return ResponseEntity.ok(updatedAnswer);
    }

    @DeleteMapping("/deleteAnswer")
    public ResponseEntity<Void> deleteAnswer(@RequestParam Long id) {
        apprenantServices.deleteAnswer(id);
        return ResponseEntity.noContent().build();
    }
}
