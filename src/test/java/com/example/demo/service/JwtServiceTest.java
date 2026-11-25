package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private static final String SECRET =
            "smartcampus-test-secret-key-that-is-at-least-32-bytes";

    @Test
    void shouldGenerateTokenWithEmailAsSubject() {
        JwtService jwtService = new JwtService(SECRET, 3600000);

        String token = jwtService.generateToken("user@example.com");

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertEquals(
                "user@example.com",
                Jwts.parser()
                        .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getSubject()
        );
    }
}
