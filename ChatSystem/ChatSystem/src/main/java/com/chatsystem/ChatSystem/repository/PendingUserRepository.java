package com.chatsystem.ChatSystem.repository;

import com.chatsystem.ChatSystem.dto.PendingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PendingUserRepository extends JpaRepository<PendingUser,String> {
    Optional<PendingUser> findByEmail(String email);
    void deleteByExpiryTimestampBefore(LocalDateTime now);

}


