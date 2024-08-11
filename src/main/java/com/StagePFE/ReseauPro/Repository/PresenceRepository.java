package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Presence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Long> {
    List<Presence> findByApprenantIdAndSessionId(Long apprenantId, Long sessionId);

    List<Presence> findByFormateurIdAndSessionId(Long formateurId, Long sessionId);
    List<Presence> findBySessionId(long sessionId);

    List<Presence> findBySessionIdAndPresent(long sessionId, boolean b);

    long countBySessionId(long sessionId);

    long countBySessionIdAndPresentTrue(long sessionId);
}