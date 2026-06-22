package com.chatsystem.ChatSystem.repository;

import com.chatsystem.ChatSystem.model.PasswordResetToken;
import com.chatsystem.ChatSystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken , String> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);
}
