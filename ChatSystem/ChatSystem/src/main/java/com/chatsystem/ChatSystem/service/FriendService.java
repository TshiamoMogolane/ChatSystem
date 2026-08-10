package com.chatsystem.ChatSystem.service;

import com.chatsystem.ChatSystem.dto.FriendResponseDTO;
import com.chatsystem.ChatSystem.dto.HomeSummaryDTO;
import com.chatsystem.ChatSystem.model.Connection;
import com.chatsystem.ChatSystem.model.User;
import com.chatsystem.ChatSystem.repository.ConnectionRepository;
import com.chatsystem.ChatSystem.repository.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendService {

    private final UserRepo userRepository;
    private final ConnectionRepository connectionRepository;
    private final Logger logger = LoggerFactory.getLogger(FriendService.class);
    public FriendService(UserRepo userRepository, ConnectionRepository connectionRepository) {
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
    }

    // ---- Connected friends ----
    public Page<FriendResponseDTO> getConnectedFriends(User currentUser, Pageable pageable) {
        // Use the new method
        Page<Connection> connections = connectionRepository.findConnectionsByUserAndStatus(
                currentUser, Connection.ConnectionStatus.ACCEPTED, pageable);

        // rest is unchanged
        List<FriendResponseDTO> dtos = connections.getContent().stream()
                .map(conn -> {
                    User other = conn.getRequester().equals(currentUser) ? conn.getAddressee() : conn.getRequester();
                    return toFriendDTO(other, "connected");
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, connections.getTotalElements());
    }

    // ---- Pending requests (incoming) ----
    public Page<FriendResponseDTO> getPendingRequests(User currentUser, Pageable pageable) {
        Page<Connection> connections = connectionRepository.findByAddresseeAndStatus(
                currentUser, Connection.ConnectionStatus.PENDING, pageable);

        List<FriendResponseDTO> dtos = connections.getContent().stream()
                .map(conn -> toFriendDTO(conn.getRequester(), "pending", conn)) // 🔥 Pass the connection
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, connections.getTotalElements());
    }
    // ---- Suggestions ----
    public Page<FriendResponseDTO> getSuggestions(User currentUser, Pageable pageable) {
        // 🚀 One single database query does EVERYTHING!
        Page<User> suggestions = userRepository.findSuggestedUsers(currentUser.getId(), pageable);

        List<FriendResponseDTO> dtos = suggestions.getContent().stream()
                .map(user -> toFriendDTO(user, "suggested"))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, suggestions.getTotalElements());

    }

    // ---- Home summary ----
    public HomeSummaryDTO getHomeSummary(User currentUser) {
        // Pending
        List<Connection> pendingConns = connectionRepository.findTop4ByAddresseeAndStatusOrderByCreatedAtDesc(
                currentUser, Connection.ConnectionStatus.PENDING);

        List<FriendResponseDTO> pendingDTOs = pendingConns.stream()
                .map(conn -> toFriendDTO(conn.getRequester(), "pending", conn))
                .collect(Collectors.toList());

        int pendingCount = connectionRepository.countByAddresseeAndStatus(
                currentUser, Connection.ConnectionStatus.PENDING);

        // Suggestions
        List<String> connectedIds = connectionRepository.findUserIdsWithAnyConnection(currentUser.getId());
        List<User> suggestedUsers = userRepository.findTop4ByIdNotInAndIdNot(connectedIds, currentUser.getId());
        List<FriendResponseDTO> suggestionDTOs = suggestedUsers.stream()
                .map(user -> toFriendDTO(user, "suggested"))
                .collect(Collectors.toList());

        int suggestionsCount = (int) userRepository.countAllByIdNotInAndIdNot(connectedIds, currentUser.getId());

        HomeSummaryDTO summary = new HomeSummaryDTO();
        summary.setPendingCount(pendingCount);
        summary.setPending(pendingDTOs);
        summary.setSuggestionsCount(suggestionsCount);
        summary.setSuggestions(suggestionDTOs);
        return summary;
    }

    // ---- Action: Send friend request ----
    @Transactional
    public void sendFriendRequest(String requesterId, String addresseeId) {
        logger.info("Starting the process of sending the request ");
        if (requesterId.equals(addresseeId)) {
            throw new RuntimeException("Cannot send request to yourself");
        }


        logger.info("Checking if the requester is found");
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));
        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new RuntimeException("Addressee not found"));

        logger.info("Checking if the the connection exist between the two");
        // Check if any connection already exists (any status) between these two
        if (connectionRepository.findByRequesterAndAddressee(requester, addressee).isPresent() ||
                connectionRepository.findByAddresseeAndRequester(addressee, requester).isPresent()) {
            throw new RuntimeException("Connection already exists or pending");
        }

        logger.info("Creating a new Connection");
        Connection conn = new Connection();
        conn.setRequester(requester);
        conn.setAddressee(addressee);
        conn.setStatus(Connection.ConnectionStatus.PENDING);
        conn.setCreatedAt(LocalDateTime.now());
        conn.setUpdatedAt(LocalDateTime.now());
        connectionRepository.save(conn);
    }

    // ---- Action: Accept request ----
    @Transactional
    public void acceptRequest(String connectionId) {

        logger.info("statring the process to a accept the request{} ",connectionId);
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (conn.getStatus() != Connection.ConnectionStatus.PENDING) {
            logger.info("Request request not found ");
            throw new RuntimeException("Not a pending request");
        }
        logger.info("change status ");
        conn.setStatus(Connection.ConnectionStatus.ACCEPTED);
        conn.setUpdatedAt(LocalDateTime.now());
        connectionRepository.save(conn);
        logger.info("done with connection ");
    }

    // ---- Action: Decline request ----
    @Transactional
    public void declineRequest(String connectionId) {
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        if (conn.getStatus() != Connection.ConnectionStatus.PENDING) {
            throw new RuntimeException("Not a pending request");
        }
        conn.setStatus(Connection.ConnectionStatus.DECLINED);
        conn.setUpdatedAt(LocalDateTime.now());
        connectionRepository.save(conn);
        // Optionally delete the record: connectionRepository.delete(conn);
    }

    // ---- Helper: convert User to DTO ----
    private FriendResponseDTO toFriendDTO(User user, String status, Connection connection) {
        FriendResponseDTO dto = new FriendResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setOnline(isUserOnline(user));
        dto.setStatus(status);

        // If the status is "pending" and a connection is provided, set the connectionId
        if ("pending".equals(status) && connection != null) {
            dto.setConnectionId(connection.getId());
        }

        return dto;
    }

    // Overload for non-pending (or when connection is not needed)
    private FriendResponseDTO toFriendDTO(User user, String status) {
        return toFriendDTO(user, status, null);
    }
    // ---- Online logic (based on lastActive timestamp) ----
    private boolean isUserOnline(User user) {
        if (user.getLastActive() == null) return false;
        return user.getLastActive().isAfter(LocalDateTime.now().minusMinutes(5));
    }
}