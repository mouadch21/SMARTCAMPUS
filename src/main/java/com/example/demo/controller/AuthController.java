package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.service.AuthService;
import com.example.demo.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Locale;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentification", description = "Création de compte et connexion")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @Operation(summary = "Créer un compte utilisateur")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (request == null || !authService.isValidRegistration(request.email(), request.password())) {
            return ResponseEntity.badRequest().body("Adresse courriel ou mot de passe invalide.");
        }

        try {
            authService.register(request.email(), request.password());
            return ResponseEntity.status(HttpStatus.CREATED).body("Compte créé.");
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cette adresse courriel est déjà utilisée.");
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Se connecter")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null) {
            return ResponseEntity.badRequest().body("Adresse courriel et mot de passe requis.");
        }

        if (authService.authenticate(request.email(), request.password())) {
            String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
            String token = jwtService.generateToken(normalizedEmail);
            return ResponseEntity.ok(new LoginResponse(token, "Bearer"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Identifiants invalides ou compte temporairement indisponible.");
    }
}
