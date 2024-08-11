package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Questions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestuionsRepository extends JpaRepository<Questions,Long> {
    List<Questions> findByApprenantId(long apprenantId);
}
