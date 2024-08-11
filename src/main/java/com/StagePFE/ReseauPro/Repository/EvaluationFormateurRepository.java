package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.EvaluationFormateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationFormateurRepository extends JpaRepository<EvaluationFormateur, Long> {
}
