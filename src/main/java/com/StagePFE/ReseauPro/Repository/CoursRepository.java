package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursRepository extends JpaRepository<Cours,Long> {
}