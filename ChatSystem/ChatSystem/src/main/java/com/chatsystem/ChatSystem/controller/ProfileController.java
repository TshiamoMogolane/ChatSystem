package com.chatsystem.ChatSystem.controller;

import com.chatsystem.ChatSystem.model.User;
import com.chatsystem.ChatSystem.service.ProfileService;
import com.chatsystem.ChatSystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserService userService;

    // ✅ GET current user profile (for the frontend)
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUser(userDetails.getUsername());
        return ResponseEntity.ok(currentUser);
    }

    // ✅ POST to upload picture – path matches frontend "/profile/picture"
    @PostMapping(value = "/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) throws IOException {

        User currentUser = userService.findUser(userDetails.getUsername());
        String newUrl = profileService.updateProfilePicture(file, currentUser);
        return ResponseEntity.ok(Map.of("newProfilePicUrl", newUrl));
    }
}