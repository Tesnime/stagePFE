package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Answers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswersRepository extends JpaRepository<Answers,Long> {
}
