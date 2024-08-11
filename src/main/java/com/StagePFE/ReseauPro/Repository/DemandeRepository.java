package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Apprenant;
import com.StagePFE.ReseauPro.Model.Demande;
import com.StagePFE.ReseauPro.Model.EvaluationApprenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeRepository extends JpaRepository<Demande,Long> {
    Demande findByCode(String code);

    List<Demande> findByStatus(String status);

    @Query("SELECT d FROM Demande d JOIN d.apprenants a WHERE a.id = :apprenantId")
    List<Demande> findDemandesByApprenantId(Long apprenantId);

    @Query("SELECT COUNT(a) FROM Demande d JOIN d.apprenants a WHERE d.formateur.id = :formateurId")
    long countApprenantsByFormateurId(long formateurId);

    @Query("SELECT COUNT(d) FROM Demande d WHERE LOWER(d.status) = 'refus' AND d.formateur.id = :formateurId")
    long countByStatusRefusAndFormateurId(@Param("formateurId") long formateurId);

    @Query("SELECT COUNT(d) FROM Demande d WHERE LOWER(d.status) = 'terminer' AND d.formateur.id = :formateurId")
    long countByStatusTerminerAndFormateurId(@Param("formateurId") long formateurId);

    @Query("SELECT COUNT(d) FROM Demande d WHERE LOWER(d.status) = 'accept' AND d.formateur.id = :formateurId")
    long countByStatusAcceptAndFormateurId(@Param("formateurId") long formateurId);

    @Query("SELECT COUNT(d) FROM Demande d WHERE d.formateur.id = :formateurId")
    long countAllDemandesByFormateurId(@Param("formateurId") long formateurId);
//    List<Apprenant> getApprenantsByid(Long id);
}
