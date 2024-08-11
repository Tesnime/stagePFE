package com.StagePFE.ReseauPro.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.StagePFE.ReseauPro.Model.interactions;

import java.util.List;


@Repository
public interface InteractionsRepositry extends JpaRepository<interactions, Long> {

    @Query("SELECT ci, COUNT(i) FROM interactions i JOIN i.centreInteret ci GROUP BY ci ORDER BY COUNT(i) DESC")
    List<Object[]> findAllGroupedByCentreInteret(Pageable pageable);

    @Query("SELECT d, COUNT(i) FROM interactions i JOIN i.difficultes d GROUP BY d ORDER BY COUNT(i) DESC")
    List<Object[]> findAllGroupedByDifficultes(Pageable pageable);
}
