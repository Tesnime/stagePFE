package com.StagePFE.ReseauPro.Service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;

public interface JWTService {

    String extractUserName(String token);

    String generateRefreshToken(Map<String,Object> extraClaims, UserDetails userDetails);

    String generateToken(UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);


    boolean isTokenExpired(String token);
}
