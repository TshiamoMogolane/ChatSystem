package com.chatsystem.ChatSystem.repository;

import com.chatsystem.ChatSystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);


    // Find users not in a list and not the current user
    List<User> findAllByIdNotInAndIdNot(List<String> ids, String userId, Pageable pageable);

    // Count users not in a list and not the current user
    long countAllByIdNotInAndIdNot(List<String> ids, String userId);

    // Top 4 suggestions (for home summary)
    List<User> findTop4ByIdNotInAndIdNot(List<String> ids, String userId);

    @Query("SELECT u FROM User u WHERE u.id != :userId")
    List<User> findAllExceptUser(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.id != :userId")

    long countAllExceptUser(@Param("userId") String userId);

    // 🔥 NEW: The exact SQL query you wrote, with pagination and count
    @Query(value = """
            SELECT u.* 
            FROM user u
            WHERE u.id != :userId
              AND NOT EXISTS (
                  SELECT 1 
                  FROM connection c
                  WHERE (c.requester_id = u.id AND c.addressee_id = :userId)
                     OR (c.addressee_id = u.id AND c.requester_id = :userId)
              )
            """,
            countQuery = """
            SELECT COUNT(u.id) 
            FROM user u
            WHERE u.id != :userId
              AND NOT EXISTS (
                  SELECT 1 
                  FROM connection c
                  WHERE (c.requester_id = u.id AND c.addressee_id = :userId)
                     OR (c.addressee_id = u.id AND c.requester_id = :userId)
              )
            """,
            nativeQuery = true)
    Page<User> findSuggestedUsers(@Param("userId") String userId, Pageable pageable);
}




