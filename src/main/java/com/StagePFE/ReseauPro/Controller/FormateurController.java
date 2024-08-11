package com.StagePFE.ReseauPro.Controller;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.Repository.FormateurRepository;
import com.StagePFE.ReseauPro.Service.ApprenantServices;
import com.StagePFE.ReseauPro.Service.FormateurServices;
import com.StagePFE.ReseauPro.dio.DemandeWithSessionsDTO;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/formateur")
@RequiredArgsConstructor
public class FormateurController {

    private final FormateurServices formateurServices;
    private final ApprenantServices apprenantServices;
    private final FormateurRepository formateurRepository;
    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Hi Formateur!");
    }

    @PostMapping("/ajoutCours")
    public Cours addCourse(@RequestBody Cours c,@RequestParam long id){
        return formateurServices.addCourses(c,id);
    }

    @GetMapping("/cours")
    public List<Cours> getCours(@RequestParam long id){
        return formateurServices.coursByID(id);
    }
    @PostMapping("/updateCours")
    public Cours updateCours(@RequestParam Long id, @RequestBody Cours cours){
        return formateurServices.UpdateCours(id,cours);
    }
    @PostMapping("/AjoutProfile")
    public Formateur profile(@RequestParam Long userId, @RequestBody Formateur formateurDetails){
        return formateurServices.UpdateFormateur(userId,formateurDetails);
    }

    @PostMapping("/ajoutFormat")
    public FormAcademique addform(@RequestBody FormAcademique c,@RequestParam long id){
        return formateurServices.addForm(c,id);
    }

    @GetMapping("/format")
    public List<FormAcademique> getForm(@RequestParam long userId){
        return formateurServices.Form(userId);
    }

    @DeleteMapping("/deleteForma")
    public String deleteForm(@RequestParam Long id) {
        return formateurServices.deleteformation(id);
    }
    @DeleteMapping("/deleteExpr")
    public String deleteExpr(@RequestParam Long id) {
        return formateurServices.deleteExperience(id);
    }
    @PostMapping("/ajoutExpr")
    public ExprPro addExpr(@RequestBody ExprPro c,@RequestParam long id){
        return formateurServices.expre(c,id);
    }

    @GetMapping("/expr")
    public List<ExprPro> getExpr(@RequestParam long userId){
        return formateurServices.expr(userId);
    }

    @PostMapping("/AjoutAutre")
    public Formateur Autre(@RequestParam Long userId, @RequestBody Formateur formateurDetails){
        return formateurServices.UpdateAutre(userId,formateurDetails);
    }

    @PostMapping("/updateForm")
    public FormAcademique update(@RequestParam Long id, @RequestBody FormAcademique form){
        return formateurServices.UpdateForm(id,form);
    }
    @PostMapping("/updateExpr")
    public ExprPro Autre(@RequestParam Long id, @RequestBody ExprPro exprPro){
        return formateurServices.UpdateExpr(id,exprPro);
    }

    @GetMapping("/formByid")
    public FormAcademique formById(@RequestParam Long id){
        return formateurServices.FormationByid(id);
    }

    @GetMapping("/exprByid")
    public ExprPro expById(@RequestParam Long id){
        return formateurServices.ExprByid(id);
    }

    @GetMapping("/profile")
    public Formateur profileById(@RequestParam Long userId){
        return formateurServices.Formateur(userId);
    }
    @PostMapping("/{sessionId}/evaluation")
    public EvaluationFormateur eval(@RequestBody EvaluationFormateur evaluation, @RequestParam long userId,@PathVariable long sessionId){
        return formateurServices.eval(evaluation,userId,sessionId);
    }
    @PostMapping("/postuler")
    public Demande demande(@RequestBody Demande demandeDetails, @RequestParam long userId){
        return formateurServices.postuler(demandeDetails,userId);
    }
    @GetMapping("/demande")
    public List<Demande> demandes(@RequestParam long id){
        return formateurServices.demandes(id);
    }
    @DeleteMapping("/deleteDemande")
    public String deleteDemande(@RequestParam Long id) {
        return formateurServices.deletedemande(id);
    }
    @GetMapping("/demandeId")
    public Demande demande(@RequestParam long id){
        return formateurServices.demande(id);
    }
    @GetMapping("/session")
    public List<Session> getSessions(@RequestParam long id){
        return formateurServices.sessions(id);
    }

    @GetMapping("/sessionId")
    public Session sessionById(@RequestParam Long id){
        return formateurServices.sessionId(id);
    }
    @GetMapping("/sessionFormateur")
    public List<Session> getSessionsByFormateurs(@RequestParam long userId){
        return formateurServices.sessionsByFormateur(userId);
    }
    @PostMapping("/{sessionId}/addComment")
    public Comments addComment(@RequestBody Comments commentDetails, @RequestParam long userId,@PathVariable long sessionId){
        return formateurServices.addComments(commentDetails,userId,sessionId);
    }
    @GetMapping("/comments")
    public List<Comments> comments(@RequestParam long id){
        return formateurServices.comments(id);
    }

//    @PostMapping("/showQRCode")
//    public String showQRCode(String qrContent, Model model) {
//        model.addAttribute("qrCodeContent", "/generateQRCode?qrContent=" + qrContent);
//        return "show-qr-code";
//    }

//    @GetMapping("/generateQRCode")
//    public void generateQRCode(String content, HttpServletResponse response) throws IOException, IOException {
//        response.setContentType("image/png");
//        byte[] qrCode = qrCodeGenerator.generateQRCode(content, 500, 500);
//        OutputStream outputStream = response.getOutputStream();
//        outputStream.write(qrCode);
//    }
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
    public ResponseEntity<Void> markPresence(@RequestParam Long formateurId, @RequestParam Long sessionId, @RequestParam boolean present) {
        formateurServices.markPresence(formateurId, sessionId, present);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/isPresent")
    public boolean isApprenantPresent(@RequestParam Long formateurId, @RequestParam Long sessionId) {
        return formateurServices.present(formateurId, sessionId);
    }

//    @GetMapping("/demandeProposer")
//    public List<Demande> dem() {
//        return formateurServices.getDemandesByStatus();
//    }
    @GetMapping("/demandeProposer")
    public List<DemandeWithSessionsDTO> dem() {
        return formateurServices.getSessionsGroupedByDemande();
    }

    @PostMapping("/addFormateur")
    public void addFormateurToDemande(@RequestParam Long demandeId, @RequestParam Long formateurId) {
        formateurServices.addFormateurToDemande(demandeId, formateurId);
    }
    @GetMapping("/totalSessions")
    public long getTotalSessions(@RequestParam long formateurId) {
        return formateurServices.getTotalSessionsForFormateur(formateurId);
    }
//    @GetMapping("/cv")
//    public ResponseEntity<byte[]> getCv(@RequestParam Long userId) {
//        return formateurServices.getCv(userId);
//    }

    @GetMapping("/averageApprenants")
    public double getAverageApprenants(@RequestParam long formateurId) {
        return formateurServices.getAverageApprenantsPerSession(formateurId);
    }
    @PutMapping("/{id}/upload-cv")
    public Formateur uploadCv(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return formateurServices.uploadCv(id,file);
    }



    @PostMapping("/{id}/upload")
    public String uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return "File is empty";
        }

        // Convertir le fichier en tableau de bytes
        byte[] imageBytes = file.getBytes();

        // Enregistrer l'image dans la base de données
        Optional<Formateur> optionalUser = formateurRepository.findById(id);
        if (optionalUser.isPresent()) {
            Formateur user = optionalUser.get();
            user.setImage(imageBytes);
            formateurRepository.save(user);
            return "File uploaded successfully";
        } else {
            return "User not found";
        }
    }

    @GetMapping("/{id}/image")
    public byte[] getImage(@PathVariable Long id) {
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
    @PostMapping("/{userId}/addCV")
    public String updateCv(@PathVariable Long userId, @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return "File is empty";
        }

        // Convertir le fichier en tableau de bytes
        byte[] imageBytes = file.getBytes();


        Optional<Formateur> optionalUser = formateurRepository.findById(userId);
        if (optionalUser.isPresent()) {
            Formateur user = optionalUser.get();
            user.setCv(imageBytes);
            formateurRepository.save(user);
            return "File uploaded successfully";
        } else {
            return "User not found";
        }

//        if (optionalFormateur.isPresent()) {
//            Formateur formateur = optionalFormateur.get();
//            try {
//                formateur.setCv(cvFile.getBytes());
//                formateurRepository.save(formateur);
//                return "File uploaded successfully";
//            } catch (IOException e) {
//                e.printStackTrace();
//                return "error";
//            }
//        } else {
//            return "User not found";
//        }
    }
    @GetMapping("/{id}/cv")
    public ResponseEntity<Resource> getCv(@PathVariable Long id) {
        Optional<Formateur> optionalFormateur = formateurRepository.findById(id);
        if (optionalFormateur.isPresent()) {
            Formateur formateur = optionalFormateur.get();
            byte[] cvData = formateur.getCv(); // Assuming getCv() returns byte[]
            if (cvData != null && cvData.length > 0) {
                ByteArrayResource resource = new ByteArrayResource(cvData);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=cv.pdf") // Adjust to display in-browser
                        .contentType(MediaType.APPLICATION_PDF) // Set the correct MIME type for PDFs
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
