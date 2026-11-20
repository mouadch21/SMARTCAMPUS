package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;
    private User user;

    @BeforeEach
    void setUp() {
        userRepository = org.mockito.Mockito.mock(UserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, passwordEncoder);
        user = new User(
            1L,
            "etudiant@smartcampus.ma",
            passwordEncoder.encode("password123"),
            true
        );
        when(userRepository.findByEmailForUpdate("etudiant@smartcampus.ma"))
                .thenReturn(Optional.of(user));
    }

    @Test
    void shouldAuthenticateWithCorrectCredentials() {
        assertTrue(authService.authenticate(
                "etudiant@smartcampus.ma",
                "password123"
        ));
        assertEquals(0, user.getFailedLoginAttempts());
        verify(userRepository).updateLoginState(user);
    }

    @Test
    void shouldRejectIncorrectPassword() {
        assertFalse(authService.authenticate(
                "etudiant@smartcampus.ma",
                "wrongpassword"
        ));
        assertEquals(1, user.getFailedLoginAttempts());
        assertFalse(user.isLocked());
        verify(userRepository).updateLoginState(user);
    }

    @Test
    void shouldLockUserAfterThreeFailedAttempts() {
        for (int attempt = 0; attempt < 3; attempt++) {
            assertFalse(authService.authenticate(
                    "etudiant@smartcampus.ma",
                    "wrongpassword"
            ));
        }

        assertTrue(user.isLocked());
        assertEquals(3, user.getFailedLoginAttempts());
        assertFalse(authService.authenticate(
                "etudiant@smartcampus.ma",
                "password123"
        ));
        org.mockito.Mockito.verify(userRepository, org.mockito.Mockito.times(3))
                .updateLoginState(user);
    }

    @Test
    void shouldResetFailedAttemptsAfterSuccessfulAuthentication() {
        authService.authenticate("etudiant@smartcampus.ma", "wrongpassword");
        authService.authenticate("etudiant@smartcampus.ma", "wrongpassword");

        assertTrue(authService.authenticate(
                "etudiant@smartcampus.ma",
                "password123"
        ));
        assertEquals(0, user.getFailedLoginAttempts());
        assertFalse(user.isLocked());
    }

    @Test
    void shouldRejectUnknownUser() {
        when(userRepository.findByEmailForUpdate("unknown@smartcampus.ma"))
                .thenReturn(Optional.empty());

        assertFalse(authService.authenticate("unknown@smartcampus.ma", "password123"));
    }

    @Test
    void shouldRejectInactiveUser() {
        user.setActive(false);

        assertFalse(authService.authenticate(
                "etudiant@smartcampus.ma",
                "password123"
        ));
        assertEquals(0, user.getFailedLoginAttempts());
        assertFalse(user.isLocked());
    }

    @Test
    void shouldRejectLockedUserWithoutIncreasingFailureCount() {
        user.setLocked(true);
        user.setFailedLoginAttempts(3);

        assertFalse(authService.authenticate("etudiant@smartcampus.ma", "password123"));
        assertEquals(3, user.getFailedLoginAttempts());
    }

    @Test
    void shouldNormalizeEmailForAuthentication() {
        assertTrue(authService.authenticate(" ETUDIANT@SMARTCAMPUS.MA ", "password123"));
    }

    @Test
    void shouldStoreHashedPasswordWhenRegistering() {
        authService.register("Etudiant@SmartCampus.ma", "password123");

        org.mockito.ArgumentCaptor<String> passwordHash =
                org.mockito.ArgumentCaptor.forClass(String.class);
        verify(userRepository).create(
                org.mockito.Mockito.eq("etudiant@smartcampus.ma"),
                passwordHash.capture()
        );
        assertTrue(passwordEncoder.matches("password123", passwordHash.getValue()));
    }

    @Test
    void shouldRejectInvalidRegistrationData() {
        assertFalse(authService.isValidRegistration("invalid-email", "password123"));
        assertFalse(authService.isValidRegistration("user@example.com", "short"));
        assertTrue(authService.isValidRegistration("user@example.com", "password123"));
    }
}
