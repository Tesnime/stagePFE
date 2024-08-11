package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Taches;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TacheRepository extends JpaRepository<Taches,Long> {
    List<Taches> findByApprenantId(long apprenantId);
}
