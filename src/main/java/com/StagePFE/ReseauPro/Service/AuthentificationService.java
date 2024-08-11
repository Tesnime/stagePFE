package com.StagePFE.ReseauPro.Service;

import com.StagePFE.ReseauPro.Model.User;
import com.StagePFE.ReseauPro.dio.JwtAuthentificationResponse;
import com.StagePFE.ReseauPro.dio.RefreshTokenRequest;
import com.StagePFE.ReseauPro.dio.SignUpRequest;
import com.StagePFE.ReseauPro.dio.SigninRequest;

public interface AuthentificationService {

    User signupForm(SignUpRequest signUpRequest);
    User signupAprenant(SignUpRequest signUpRequest);
    JwtAuthentificationResponse signin(SigninRequest signinRequest);
    JwtAuthentificationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
}
