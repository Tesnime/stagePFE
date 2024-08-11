package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification,Long> {
    List<Certification> findByApprenantIsNullAndDemandeIsNull();

    List<Certification> findByApprenantIdAndDemandeId(Long apprenantId, Long demandeId);
}
