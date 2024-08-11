package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Formateur;
import com.StagePFE.ReseauPro.Model.Presence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Long> {

}
