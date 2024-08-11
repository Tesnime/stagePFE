package com.StagePFE.ReseauPro.Controller;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.Repository.CertificationRepository;
import com.StagePFE.ReseauPro.Repository.FormateurRepository;
import com.StagePFE.ReseauPro.Service.AdminServices;
import com.StagePFE.ReseauPro.Service.ApprenantServices;
import com.StagePFE.ReseauPro.Service.FormateurServices;
import com.StagePFE.ReseauPro.dio.DemandeWithFirstSessionDate;
import com.StagePFE.ReseauPro.dio.DemandeWithSessionsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminServices adminServices;
    private final FormateurServices formateurServices;
    private final ApprenantServices apprenantServices;
    private final CertificationRepository certificationRepository;
    private final FormateurRepository formateurRepository;

    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Hi Admin!");
    }

    @GetMapping("/demandes")
    public List<Demande> getDemandes(){
        return adminServices.demandes();
    }
    @GetMapping("/demandesterm")
    public List<Demande> getDemandesTerminer(){
        return adminServices.demandesTerminer();
    }
    @GetMapping("/demandesAccep")
    public List<Demande> getDemandesAccepter(){
        return adminServices.demandesAcceptes();
    }
    @GetMapping("/nbDemandes")
    public int getNbDemandes(){
        return adminServices.demandesEnTraitement();
    }
    @GetMapping("/demandeById")
    public Demande getDemandeById(@RequestParam long id){
        return adminServices.demandeId(id);
    }
    @GetMapping("/expr")
    public List<ExprPro> getExpr(@RequestParam long userId){
        return adminServices.expr(userId);
    }
    @GetMapping("/format")
    public List<FormAcademique> getForm(@RequestParam long userId){
        return adminServices.Form(userId);
    }
    @PostMapping("/refus")
    public Demande refus(@RequestBody Demande d,@RequestParam long id){
        return adminServices.refus(d,id);
    }
    @PostMapping("/accept")
    public Demande accept(@RequestParam long id){
        return adminServices.accept(id);
    }
    @PostMapping("/terminer")
    public Demande terminer(@RequestParam long id){
        return adminServices.terminer(id);
    }
    @PostMapping("/addSession")
    public Session addSession(@RequestBody Session s, @RequestParam long id){
        return adminServices.session(s,id);
    }
    @PostMapping("/updateSession")
    public Session updateSession(@RequestParam Long id, @RequestBody Session session){
        return adminServices.updateSession(session,id);
    }
    @GetMapping("/sessionByDemande")
    public List<Session> getSessions(@RequestParam long id){
        return formateurServices.sessions(id);
    }
    @GetMapping("/sessionById")
    public Session getSession(@RequestParam long id){
        return formateurServices.sessionId(id);
    }
    @GetMapping("/allSessions")
    public List<Session> getAllSessions(){
        return adminServices.sessions();
    }
    @GetMapping("/allFormateurs")
    public List<Formateur> getAllFormateurs(){
        return adminServices.formateurs();
    }
    @GetMapping("/comments")
    public List<Comments> comments(@RequestParam long id){
        return formateurServices.comments(id);
    }

    @GetMapping("/stat")
    public Map<String, Map<String, Long>> getStatistics(@RequestParam long id) {
        return adminServices.getStatistics(id);
    }
    @GetMapping("/tot")
    public Map<String, Integer> getStatistics() {
        return adminServices.getStat();
    }

    @GetMapping("/evallist")
    public List<EvaluationApprenant> com(@RequestParam long id){
        return adminServices.evaluationApprenantList(id);
    }

    @PostMapping("/presence")
    public ResponseEntity<Void> markPresence(@RequestParam Long apprenantId, @RequestParam Long sessionId, @RequestParam boolean present) {
        apprenantServices.markPresence(apprenantId, sessionId, present);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/listePresence")
    public List<Presence> presences(@RequestParam long sessionId){
        return adminServices.presenceList(sessionId);
    }
    @GetMapping("/nbrePresent")
    public int nbpresences(@RequestParam long sessionId){
        if(adminServices.presencenbr(sessionId)==0){
            return 0;
        }
        return adminServices.presencenbr(sessionId)-1;
    }
    @GetMapping("/groupedByInterests")
    public List<Object[]> getInteractionsGroupedByInterests() {
        return adminServices.getAllInteractionsGroupedByInterests();
    }
    @GetMapping("/groupedByDifficultes")
    public List<Object[]> getInteractionsGroupedByDifficultes() {
        return adminServices.getAllInteractionsGroupedByDifficultes();
    }

    @GetMapping("/getStar")
    public double star(@RequestParam long demandeId) {
        return adminServices.getStar(demandeId);
    }
    @GetMapping("/getApprenantStat")
    public Presence appStat(@RequestParam long apprenantId,@RequestParam long sessionId) {
        return adminServices.getApprenantStat(apprenantId,sessionId);
    }

    @GetMapping("/presenceRate")
    public double getPresenceRate(@RequestParam long sessionId) {
        return adminServices.calculatePresenceRate(sessionId);
    }
    @GetMapping("/overallPresenceRate")
    public double getOverallPresenceRate() {
        return adminServices.calculateOverallPresenceRateByFormateur();
    }

    @PostMapping("/proposerSession")
    public Demande demande(@RequestBody Demande demandeDetails) {
        return adminServices.ajoutFormation(demandeDetails);
    }
    @PutMapping("/updateDemande")
    public ResponseEntity<Demande> updateDemande(@RequestParam Long id, @RequestBody Demande demandeDetails) {
        Demande updatedDemande = adminServices.updateDemande(id, demandeDetails);
        return ResponseEntity.ok(updatedDemande);
    }
    @PostMapping("/fomateurToDemande")
    public Demande addFormateurToDemande(@RequestParam long demandeId, @RequestParam long formateurId) {
        return adminServices.addFormateurToDemande(demandeId,formateurId);
    }

    @PutMapping("/upload")
    public ResponseEntity<String> uploadTemplate(@RequestParam("file") MultipartFile file) {
      return adminServices.storeFile(file);
    }
    @GetMapping("/getCertificate")
    public List<Certification> getCertificate() {
        return adminServices.getCertificate();
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
//    @PostMapping("/generate")
//    public ResponseEntity<byte[]> generateCertificate(@RequestParam("name") String name,
//                                                      @RequestParam("thematic") String thematic,
//                                                      @RequestParam("date") String date,
//                                                      @RequestParam("template") String template) {
//        try {
//            byte[] certificate = adminServices.generateCertificate(name, thematic, date, template);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.setContentDispositionFormData("inline", "certificate.pdf");
//            headers.setContentLength(certificate.length);
//
//            return new ResponseEntity<>(certificate, headers, HttpStatus.OK);
//        } catch (RuntimeException e) {
//            // Log the error
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }
    @PostMapping("/certificate/modify/{certId}/{demandeId}")
    public ResponseEntity<String> modifyCertificate(@PathVariable Long certId, @PathVariable Long demandeId) {
        return adminServices.modifyCertificate(certId, demandeId);
    }
    @PostMapping("/certificate/modifyApp/{certId}/{apprenantId}")
    public ResponseEntity<String> modifyCertificateApprenant(@PathVariable Long certId, @PathVariable Long apprenantId) {
            return adminServices.modifyCertificate (certId, apprenantId);
        }
    @GetMapping("/first-session")
    public Optional<Session> getFirstSession(@RequestParam long formateurId) {
        return adminServices.getFirstSessionByFormateur(formateurId);
    }
    @GetMapping("/demande")
    public List<DemandeWithFirstSessionDate> demandes(@RequestParam long id){
        return adminServices.getDemandesByFormateurId(id);
    }
    @GetMapping("/themePercentages")
    public ResponseEntity<Map<String, Double>> getThemePercentages(@RequestParam long formateurId) {
        Map<String, Double> themePercentages = adminServices.calculateThemePercentages(formateurId);
        return ResponseEntity.ok(themePercentages);
    }

    @GetMapping("/percentages")
    public Map<String, Double> getPercentagesForFormateur(@RequestParam long formateurId) {
        return adminServices.calculatePercentagesForFormateur(formateurId);
    }

    @GetMapping("/taux")
    public Double getTauxDePresence(@RequestParam long formateurId) {
        return adminServices.calculatePresenceRateByFormateur(formateurId);
    }

    @GetMapping("/StarMoy")
    public Double getStarRate(@RequestParam long formateurId) {
        return adminServices.calculateStarRateByFormateur(formateurId);
    }

    @GetMapping("/response-distributions")
    public Map<String, Map<String, Double>> getResponseDistributions(@RequestParam long id) {
        return adminServices.calculateResponseDistributionsByFormateur(id);
    }

    @GetMapping("/demandeTheme")
    public Map<String, Double> getDemandeThemePercentage() {
        return adminServices.calculateAllDemandeThemePercentages();
    }
    @GetMapping("/grouped-by-demande")
    public List<DemandeWithSessionsDTO> getSessionsGroupedByDemande() {
        return adminServices.getSessionsGroupedByDemande();
    }

    @GetMapping("/presenceByApprenant")
    public List<Presence> getPresenceByApprenantIdAndSessionId(@RequestParam Long apprenantId, @RequestParam Long sessionId) {
        List<Presence> presence = adminServices.findPresence(apprenantId, sessionId);
        return presence;
    }

    @GetMapping("/presenceByFormateur")
    public List<Presence> getFormateurPresence(@RequestParam Long formateurId, @RequestParam Long sessionId) {
        List<Presence> presence = adminServices.findFormateurPresence(formateurId,sessionId);
        return presence;
    }

    @GetMapping("/sessionsByDemande")
    public List<Session> sessionByDemande(@RequestParam Long demandeId) {
       return adminServices.sessionsByDemande(demandeId);
    }
    @GetMapping("/fistLastSession")
    public Map<String, Long> getFirstAndLAstSession(@RequestParam long demandeId){
        return formateurServices.getFirstAndLastSessionIdsByDate(demandeId);
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
    @GetMapping("/{id}/image")
    public byte[] getImage(@PathVariable Long id) {
        Optional<Formateur> optionalUser = formateurRepository.findById(id);
        if (optionalUser.isPresent()) {
            return optionalUser.get().getImage();
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @DeleteMapping("/deleteSession")
    public ResponseEntity<Void> deleteSession(@RequestParam Long id) {
        adminServices.deleteSessionById(id);
        return ResponseEntity.noContent().build();
    }
}
