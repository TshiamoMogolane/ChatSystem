package com.chatsystem.ChatSystem.service;

import com.chatsystem.ChatSystem.model.User;
import com.chatsystem.ChatSystem.repository.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;  // ✅ ADD
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProfileService {

    private final Logger logger = LoggerFactory.getLogger(ProfileService.class);
    private final Path uploadRoot = Paths.get("uploads/profiles");

    @Autowired  // ✅ ADD THIS – otherwise messagingTemplate is null!
    private SimpMessagingTemplate messagingTemplate;

    private final UserRepo userRepo;

    public ProfileService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Transactional
    public String updateProfilePicture(MultipartFile file, User currentUser) throws IOException {
        String oldPictureUrl = currentUser.getProfilePictureUrl();

        String extension = getFileExtension(file.getOriginalFilename());
        String newFilename = currentUser.getId() + "_" + System.currentTimeMillis() + "." + extension;
        Path newPath = uploadRoot.resolve(newFilename);

        Files.createDirectories(uploadRoot);
        Files.copy(file.getInputStream(), newPath, StandardCopyOption.REPLACE_EXISTING);
        logger.info("File saved to: {}", newPath.toAbsolutePath());
        String newUrl = "/api/images/" + newFilename;
        currentUser.setProfilePictureUrl(newUrl);
        userRepo.save(currentUser);

        if (oldPictureUrl != null) {
            deleteOldFileAsync(oldPictureUrl);
        }

        broadcastProfileUpdate(currentUser, newUrl);
        return newUrl;
    }

    @Async
    public void deleteOldFileAsync(String oldUrl) {
        try {
            String filename = Paths.get(oldUrl).getFileName().toString();
            Path oldPath = uploadRoot.resolve(filename);
            Files.deleteIfExists(oldPath);
        } catch (IOException e) {
            logger.info("File does not exist or could not be deleted: {}", oldUrl);
        }
    }

    private void broadcastProfileUpdate(User user, String newUrl) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getId());
        payload.put("newProfilePicUrl", newUrl);
        messagingTemplate.convertAndSend("/topic/profile-updates", payload);
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf(".");
        return (dotIndex == -1) ? "jpg" : filename.substring(dotIndex + 1);
    }
}