package com.StagePFE.ReseauPro.Service.impl;

import com.StagePFE.ReseauPro.Model.Apprenant;
import com.StagePFE.ReseauPro.Model.Formateur;
import com.StagePFE.ReseauPro.Model.Role;
import com.StagePFE.ReseauPro.Model.User;
import com.StagePFE.ReseauPro.Repository.FormateurRepository;
import com.StagePFE.ReseauPro.Repository.SessionRepository;
import com.StagePFE.ReseauPro.Repository.UserRepository;
import com.StagePFE.ReseauPro.Service.AuthentificationService;
import com.StagePFE.ReseauPro.Service.JWTService;
import com.StagePFE.ReseauPro.dio.JwtAuthentificationResponse;
import com.StagePFE.ReseauPro.dio.RefreshTokenRequest;
import com.StagePFE.ReseauPro.dio.SignUpRequest;
import com.StagePFE.ReseauPro.dio.SigninRequest;
import com.fasterxml.jackson.databind.util.JSONPObject;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import netscape.javascript.JSObject;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthentificationServiceImpl implements AuthentificationService {

    private final UserRepository userRepository;
    private final FormateurRepository formateurRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;
    public Formateur signupForm(SignUpRequest signUpRequest){
        Formateur user=new Formateur();
        user.setEmail(signUpRequest.getEmail());
        user.setFirstname(signUpRequest.getFirstname());
        user.setLastname(signUpRequest.getLastname());
        user.setRole(Role.FORMATEUR);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        return formateurRepository.save(user);


    }

    public User signupAprenant(SignUpRequest signUpRequest){
        User user=new Apprenant();
        user.setEmail(signUpRequest.getEmail());
        user.setFirstname(signUpRequest.getFirstname());
        user.setLastname(signUpRequest.getLastname());
        user.setRole(Role.APPRENANT);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        return userRepository.save(user);


    }


    public JwtAuthentificationResponse signin(SigninRequest signinRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(),
                signinRequest.getPassword()));

        var user= userRepository.findByEmail(signinRequest.getEmail()).orElseThrow(()-> new IllegalArgumentException("invalid email or password"));
        var jwt=jwtService.generateToken(user);
//        var refreshToken=jwtService.generateRefreshToken(new HashMap<>(),user);

        JwtAuthentificationResponse jwtAuthentificationResponse=new JwtAuthentificationResponse();

        jwtAuthentificationResponse.setToken(jwt);


//        jwtAuthentificationResponse.setRefreshToken(refreshToken);
        return jwtAuthentificationResponse;
    }

    public JwtAuthentificationResponse refreshToken(RefreshTokenRequest refreshTokenRequest ){
        String userEmail = jwtService.extractUserName(refreshTokenRequest.getToken());
        User user=userRepository.findByEmail(userEmail).orElseThrow();
        if (jwtService.isTokenValid(refreshTokenRequest.getToken(),user)){
            var jwt= jwtService.generateToken(user);

            JwtAuthentificationResponse jwtAuthentificationResponse=new JwtAuthentificationResponse();

            jwtAuthentificationResponse.setToken(jwt);
//            jwtAuthentificationResponse.setRefreshToken(refreshTokenRequest.getToken());
            return jwtAuthentificationResponse;
        }
        return null;
    }
}
