package com.chatsystem.ChatSystem.controller;

import com.chatsystem.ChatSystem.dto.FriendResponseDTO;
import com.chatsystem.ChatSystem.dto.HomeSummaryDTO;
import com.chatsystem.ChatSystem.model.User;
import com.chatsystem.ChatSystem.service.FriendService;
import com.chatsystem.ChatSystem.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final FriendService friendService;
    private final UserService userService;
    public FriendController(FriendService friendService,UserService userService) {
        this.friendService = friendService;
        this.userService = userService;
    }

    @GetMapping("/connected")
    public ResponseEntity<Page<FriendResponseDTO>> getConnected(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        User currentUser = userService.findUser(userDetails.getUsername());
        return ResponseEntity.ok(friendService.getConnectedFriends(currentUser, pageable));

    }

    @GetMapping("/pending")
    public ResponseEntity<Page<FriendResponseDTO>> getPending(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {

        User currentUser = userService.findUser(userDetails.getUsername());
        return ResponseEntity.ok(friendService.getPendingRequests(currentUser, pageable));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<Page<FriendResponseDTO>> getSuggestions(

            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {

            User currentUser = userService.findUser(userDetails.getUsername());
        return ResponseEntity.ok(friendService.getSuggestions(currentUser, pageable));

    }

    @GetMapping("/home-summary")
    public ResponseEntity<HomeSummaryDTO> getHomeSummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = userService.findUser(userDetails.getUsername());
        return ResponseEntity.ok(friendService.getHomeSummary(currentUser));
    }

    // ---- Action endpoints ----
    @PostMapping("/request")
    public ResponseEntity<?> sendRequest(
            @AuthenticationPrincipal UserDetails userDetails ,
            @RequestParam String addresseeId) {

        User currentUser = userService.findUser(userDetails.getUsername());
        friendService.sendFriendRequest(currentUser.getId(), addresseeId);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/accept/{connectionId}")
    public ResponseEntity<?> acceptRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String connectionId) {

        User currentUser = userService.findUser(userDetails.getUsername());
        friendService.acceptRequest(connectionId);
        return ResponseEntity.ok().build();

    }

    @PostMapping("/decline/{connectionId}")
    public ResponseEntity<?> declineRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String connectionId) {
        friendService.declineRequest(connectionId);
        return ResponseEntity.ok().build();

    }
}