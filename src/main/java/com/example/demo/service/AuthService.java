package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Service
public class AuthService {

    private static final int MAX_FAILED_LOGIN_ATTEMPTS = 3;
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean isValidRegistration(String email, String password) {
        return email != null
                && EMAIL_PATTERN.matcher(email.trim()).matches()
                && password != null
                && password.length() >= MIN_PASSWORD_LENGTH
                && password.getBytes(StandardCharsets.UTF_8).length <= 72;
    }

    @Transactional
    public void register(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        userRepository.create(normalizedEmail, passwordEncoder.encode(password));
    }

    @Transactional
    public boolean authenticate(String email, String password) {
        if (email == null || password == null) {
            return false;
        }

        User user = userRepository.findByEmailForUpdate(normalizeEmail(email)).orElse(null);
        if (user == null || !user.isActive() || user.isLocked()) {
            return false;
        }

        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            user.setFailedLoginAttempts(0);
            userRepository.updateLoginState(user);
            return true;
        }

        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        if (user.getFailedLoginAttempts() >= MAX_FAILED_LOGIN_ATTEMPTS) {
            user.setLocked(true);
        }
        userRepository.updateLoginState(user);

        return false;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
