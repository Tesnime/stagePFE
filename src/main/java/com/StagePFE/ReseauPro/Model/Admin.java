package com.StagePFE.ReseauPro.Model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity

public class Admin extends User{
}
