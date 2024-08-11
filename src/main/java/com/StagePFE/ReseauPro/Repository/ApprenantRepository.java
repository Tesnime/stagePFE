package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Apprenant;
import com.StagePFE.ReseauPro.Model.Demande;
import com.StagePFE.ReseauPro.Model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {

}
