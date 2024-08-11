package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Demande;
import com.StagePFE.ReseauPro.Model.Formateur;
import com.StagePFE.ReseauPro.Model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session,Long> {
    @Query("SELECT s FROM Session s WHERE s.demande.formateur.id = :formateurId")
    List<Session> findAllByFormateurId(@Param("formateurId") long formateurId);

    @Query("SELECT COUNT(s) FROM Session s WHERE s.demande.formateur.id = :formateurId")
    long countByFormateurId(long formateurId);


    @Query("SELECT s FROM Session s WHERE s.demande.formateur.id = :formateurId ORDER BY s.date ASC")
    List<Session> findByFormateurOrderByDateAsc(@Param("formateurId") long formateurId);

    @Query("SELECT s FROM Session s WHERE s.demande.id = :demandeId")
    List<Session> findByDemandeId(@Param("demandeId") long demandeId);

    @Query("SELECT s.date FROM Session s WHERE s.demande.id = :demandeId ORDER BY s.date ASC")
    @Transactional(readOnly = true)
    Date findFirstSessionDateByDemandeId(@Param("demandeId") int demandeId);

//    @Query("SELECT s.demande AS demande, COLLECT(s) AS sessions " +
//            "FROM Session s GROUP BY s.demande")
//    Map<Demande, List<Session>> findSessionsGroupedByDemande();\
@Query(value = "SELECT s.id AS sessionId, s.demande_id AS demandeId, d.* " +
        "FROM session s " +
        "JOIN demande d ON s.demande_id = d.id", nativeQuery = true)
List<Object[]> findSessionsWithDemande();
}
