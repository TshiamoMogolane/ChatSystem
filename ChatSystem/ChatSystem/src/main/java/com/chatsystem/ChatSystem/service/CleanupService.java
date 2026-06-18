package com.chatsystem.ChatSystem.service;

import com.chatsystem.ChatSystem.repository.PendingUserRepository;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@EnableScheduling   // <-- needed if not already enabled elsewhere
public class CleanupService {

    private final PendingUserRepository pendingUserRepo;

    public CleanupService(PendingUserRepository pendingUserRepo) {
        this.pendingUserRepo = pendingUserRepo;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    // runs every 60 seconds
    public void cleanExpiredPendingUsers() {
        pendingUserRepo.deleteByExpiryTimestampBefore(LocalDateTime.now());
        System.out.println("Cleaned expired pending users"); // optional log
    }
}