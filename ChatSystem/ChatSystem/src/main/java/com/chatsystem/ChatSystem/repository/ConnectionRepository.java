package com.chatsystem.ChatSystem.repository;

import com.chatsystem.ChatSystem.model.Connection;
import com.chatsystem.ChatSystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, String> {

    // ✅ Correct query with parentheses
    @Query("SELECT c FROM Connection c WHERE (c.requester = :user OR c.addressee = :user) AND c.status = :status")
    Page<Connection> findConnectionsByUserAndStatus(
            @Param("user") User user,
            @Param("status") Connection.ConnectionStatus status,
            Pageable pageable);
    // For connected friends (ACCEPTED) – either requester or addressee
    Page<Connection> findByRequesterOrAddresseeAndStatus(
            User requester, User addressee, Connection.ConnectionStatus status, Pageable pageable);

    // For pending requests – current user is addressee
    Page<Connection> findByAddresseeAndStatus(User addressee, Connection.ConnectionStatus status, Pageable pageable);

    // Home summary: top 4 pending
    List<Connection> findTop4ByAddresseeAndStatusOrderByCreatedAtDesc(
            User addressee, Connection.ConnectionStatus status);

    Optional<Connection> findByRequesterAndAddressee(User requester, User addressee);
    Optional<Connection> findByAddresseeAndRequester(User addressee, User requester);
    // Count pending
    int countByAddresseeAndStatus(User addressee, Connection.ConnectionStatus status);

    // Get all user IDs that have any connection with the given user (any status)
    @Query("SELECT DISTINCT CASE WHEN c.requester.id = :userId THEN c.addressee.id ELSE c.requester.id END " +
            "FROM Connection c WHERE c.requester.id = :userId OR c.addressee.id = :userId")
    List<String> findUserIdsWithAnyConnection(@Param("userId") String userId);
}