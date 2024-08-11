package com.StagePFE.ReseauPro.Controller;

import com.StagePFE.ReseauPro.Model.Apprenant;
import com.StagePFE.ReseauPro.Model.Formateur;
import com.StagePFE.ReseauPro.Model.Role;
import com.StagePFE.ReseauPro.Model.User;
import com.StagePFE.ReseauPro.Repository.ApprenantRepository;
import com.StagePFE.ReseauPro.Repository.FormateurRepository;
import com.StagePFE.ReseauPro.Repository.UserRepository;
import com.StagePFE.ReseauPro.Service.AuthentificationService;
import com.StagePFE.ReseauPro.Service.JWTService;
import com.StagePFE.ReseauPro.dio.JwtAuthentificationResponse;
import com.StagePFE.ReseauPro.dio.RefreshTokenRequest;
import com.StagePFE.ReseauPro.dio.SignUpRequest;
import com.StagePFE.ReseauPro.dio.SigninRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", exposedHeaders = "Authorization")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthentificationController {

    private final AuthentificationService authentificationService;
    private final JWTService jwtService;
    private final UserRepository userRepository;
    @PostMapping("/signup/formateur")
    public ResponseEntity<User> signupFormateur(@RequestBody SignUpRequest signUpRequest){
        return ResponseEntity.ok(authentificationService.signupForm(signUpRequest));
    }

    @PostMapping("/signup/apprenant")
    public ResponseEntity<User> signupApprenant(@RequestBody SignUpRequest signUpRequest){
        return ResponseEntity.ok(authentificationService.signupAprenant(signUpRequest));
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthentificationResponse> signin(@RequestBody SigninRequest signinRequest) {
//        return ResponseEntity.ok(authentificationService.signin(signinRequest));
        JwtAuthentificationResponse response = authentificationService.signin(signinRequest);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + response.getToken());

        return ResponseEntity.ok()
                .headers(headers)
                .body(response);
    }
    @GetMapping("/user-details")
    public Optional<User> getUser(@RequestParam String email) {
        return userRepository.findByEmail(email);
    }

    @GetMapping("/token")
    public boolean isTokenExpired(@RequestParam String token) {
        return jwtService.isTokenExpired(token);
    }

//    @PostMapping("/refresh")
//    public ResponseEntity<JwtAuthentificationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest){
//        return ResponseEntity.ok(authentificationService.refreshToken(refreshTokenRequest));
//    }
@Autowired
private ApprenantRepository apprenantRepository;
    @Autowired
    private FormateurRepository formateurRepository;
@PostMapping("/kk")
public void l() {
//        return ResponseEntity.ok(authentificationService.signin(signinRequest));
    List<Formateur> formateurs = formateurRepository.findAll();
    List<Apprenant> apprenants = apprenantRepository.findAll();
    for (Formateur f : formateurs
    ) {
        f.setRole(Role.FORMATEUR);

    }
    for (Apprenant a : apprenants
    ) {
        a.setRole(Role.APPRENANT);
    }
    formateurRepository.saveAll(formateurs);
    apprenantRepository.saveAll(apprenants);
}


}


