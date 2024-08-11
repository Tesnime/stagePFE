package com.StagePFE.ReseauPro.Repository;

import com.StagePFE.ReseauPro.Model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormAcademiqueRepository extends JpaRepository<com.StagePFE.ReseauPro.Model.FormAcademique, Long> {
}
