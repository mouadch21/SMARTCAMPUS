package com.example.demo.repository;

import com.example.demo.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private static final RowMapper<User> USER_ROW_MAPPER = (resultSet, rowNumber) -> {
        User user = new User(
                resultSet.getLong("id"),
                resultSet.getString("email"),
                resultSet.getString("password_hash"),
                resultSet.getBoolean("active")
        );
        user.setFailedLoginAttempts(resultSet.getInt("failed_login_attempts"));
        user.setLocked(resultSet.getBoolean("locked"));
        return user;
    };

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<User> findByEmailForUpdate(String email) {
        List<User> users = jdbcTemplate.query(
                "SELECT id, email, password_hash, active, failed_login_attempts, locked "
                        + "FROM users WHERE email = ? FOR UPDATE",
                USER_ROW_MAPPER,
                email
        );
        return users.stream().findFirst();
    }

    public void create(String email, String passwordHash) {
        jdbcTemplate.update(
                "INSERT INTO users (email, password_hash, active) VALUES (?, ?, TRUE)",
                email,
                passwordHash
        );
    }

    public void updateLoginState(User user) {
        jdbcTemplate.update(
                "UPDATE users SET failed_login_attempts = ?, locked = ? WHERE id = ?",
                user.getFailedLoginAttempts(),
                user.isLocked(),
                user.getId()
        );
    }
}
