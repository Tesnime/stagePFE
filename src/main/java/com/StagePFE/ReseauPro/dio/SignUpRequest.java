package com.StagePFE.ReseauPro.dio;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class SignUpRequest {

    private String firstname;

    private String lastname;

    private String email;

    private String password;


}
