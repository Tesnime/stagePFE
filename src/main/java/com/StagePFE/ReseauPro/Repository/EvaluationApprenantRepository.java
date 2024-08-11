package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.EvaluationApprenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationApprenantRepository extends JpaRepository<EvaluationApprenant,Long> {
//    List<EvaluationApprenant> findByDemnade(long id);
Optional<EvaluationApprenant> findByApprenantIdAndDemande2Id(Long apprenantId, Long demande2Id);
}
