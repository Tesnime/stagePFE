package com.StagePFE.ReseauPro.Service;

import com.StagePFE.ReseauPro.Model.*;
import com.StagePFE.ReseauPro.Repository.ApprenantRepository;
import com.StagePFE.ReseauPro.Repository.DemandeRepository;
import com.StagePFE.ReseauPro.Repository.FormateurRepository;
import com.StagePFE.ReseauPro.Repository.InteractionsRepositry;
import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Formatter;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class DataGenerationService {

    @Autowired
    private ApprenantRepository apprenantRepository;
    @Autowired
    private FormateurRepository formateurRepository;
    @Autowired
    private DemandeRepository demandeRepository;
    @Autowired
    private InteractionsRepositry interactionsRepositry;

    private final Faker faker = new Faker();
    private final Random random = new Random();

    @PostConstruct
    public void generateData() {
//        generateApprenants(100);
//        generateDemandes(2);
//        generateFormateurs(50);
//        generateInteractions(500);
//        List<Formateur> formateurs = formateurRepository.findAll();
//        List<Apprenant> apprenants = apprenantRepository.findAll();
//        for (Formateur f: formateurs
//             ) {
//            f.setRole(Role.FORMATEUR);
//
//        }
//        for (Apprenant a:apprenants
//             ) {
//            a.setRole(Role.APPRENANT);
//        }
//        formateurRepository.saveAll(formateurs);
//        apprenantRepository.saveAll(apprenants);
    }

    private void generateApprenants(int count) {
        for (int i = 0; i < count; i++) {
            Apprenant apprenant = new Apprenant();
            apprenant.setFirstname(faker.name().firstName());
            apprenant.setLastname(faker.name().lastName());
            apprenant.setSociete(faker.company().name());
            apprenant.setCin(String.format("%08d", random.nextInt(100_000_000)));
            apprenant.setNaissance(faker.date().birthday(18, 60));
            apprenant.setEmail(faker.internet().emailAddress());
            apprenant.setTel(faker.phoneNumber().cellPhone());
            apprenant.setTelFix(faker.phoneNumber().phoneNumber());
            apprenant.setAdrress(faker.address().fullAddress());
            apprenant.setPoste(faker.job().title());
            apprenant.setRole(Role.APPRENANT);
            apprenantRepository.save(apprenant);
        }
    }

    private void generateFormateurs(int count) {
        for (int i = 0; i < count; i++) {
            Formateur formateur = new Formateur();
            formateur.setFirstname(faker.name().firstName());
            formateur.setLastname(faker.name().lastName());
            formateur.setRib(faker.finance().iban("TN"));
            formateur.setCIN(String.format("%08d", random.nextInt(100_000_000)));
            formateur.setNaissance(faker.date().birthday(18, 60));
            formateur.setEmail(faker.internet().emailAddress());
            formateur.setTel(faker.phoneNumber().cellPhone());
            formateur.setAdresse(faker.address().fullAddress());
            formateur.setPoste(faker.job().title());
            formateur.setCompetance(generateRandomCompetences());
            formateur.setComTech(generateRandomCompetenceTech());
            formateur.setBio(faker.lorem().paragraph());
            formateur.setRole(Role.FORMATEUR);
            formateurRepository.save(formateur);
        }
    }
    private List<String> generateRandomCompetences() {
        List<String> competences = new ArrayList<>();
        for (int i = 0; i < random.nextInt(5)+1; i++){
        competences.add(faker.options().option(
                "Gestion de projet",
                "Formation et développement",
                "Gestion des ressources humaines",
                "Communication interpersonnelle",
                "Leadership",
                "Résolution de problèmes",
                "Esprit d'équipe",
                "Analyse de données",
                "Planification stratégique"
        ));}
        return competences;
    }
    private List<String> generateRandomCompetenceTech() {
        List<String> competences = new ArrayList<>();
        for (int i = 0; i < random.nextInt(5)+1; i++){
        competences.add(faker.options().option(
                "Java",
                "Spring Boot",
                "Angular",
                "SQL",
                "DevOps",
                "Machine Learning",
                "AI",
                "Security",
                "Cloud Computing",
                "Big Data",
                "Data Engineering",
                "Data Science",
                "Web Development",
                "Mobile Development",
                "UI/UX Design",
                "Network Security",
                "Embedded Systems",
                "IoT",
                "Blockchain",
                "Virtualization",
                "Containerization",
                "Microservices",
                "Cybersecurity",
                "Natural Language Processing (NLP)",
                "Computer Vision",
                "Robotics",
                "Artificial Intelligence (AI)",
                "Machine Learning (ML) Algorithms",
                "Deep Learning",
                "Reinforcement Learning",
                "Data Visualization",
                "Statistical Analysis",
                "Business Intelligence (BI)"
        ));}
        return competences;
    }

    private void generateDemandes(int count) {
        List<Formateur> formateurs = formateurRepository.findAll();
        List<Apprenant> apprenants = apprenantRepository.findAll();

        Demande demande = new Demande();
        demande.setFormateur(formateurs.get(random.nextInt(formateurs.size())));
        demande.setNbrSession(random.nextInt(4) + 1);
        demande.setTheme(generateRandomCompetenceTech());
        demande.setTitre(faker.lorem().sentence());
        demande.setDescription(faker.lorem().paragraph());
        demande.setDate(faker.date().past(30,java.util.concurrent.TimeUnit.DAYS));
        demande.setDoc(faker.file().fileName());
        demande.setRaison(faker.lorem().sentence());
        demande.setStatus(faker.options().option("traitement", "Accept", "Refus"));
        demande.setCode(generateUniqueCode());

        // Génération aléatoire des apprenants liés à cette demande
        int numberOfApprenants = random.nextInt(15) + 1;  // Entre 1 et 5 apprenants
        demande.setApprenants(selectRandomItems(apprenants, numberOfApprenants));

        demandeRepository.save(demande);
    }
    private void generateInteractions(int count) {

        List<Apprenant> apprenants = apprenantRepository.findAll();

        for (int i = 0; i < count; i++) {
            interactions interactions = new interactions();
            interactions.setDifficultes(generateRandomCompetenceTech());
            interactions.setCentreInteret(generateRandomCompetenceTech());
            interactions.setObjectif(faker.lorem().sentence());
            interactions.setApprenants(selectRandomItems(apprenants, random.nextInt(1) + 1));

            interactionsRepositry.save(interactions);
        }
    }
    private String generateUniqueCode() {
        // Génère un code unique aléatoire
        return faker.regexify("[A-Z]{3}-[0-9]{4}");
    }

    private <T> List<T> selectRandomItems(List<T> items, int count) {
        // Sélectionne de manière aléatoire un nombre spécifié d'éléments à partir d'une liste
        List<T> selectedItems = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            selectedItems.add(items.get(random.nextInt(items.size())));
        }
        return selectedItems;
    }
}
