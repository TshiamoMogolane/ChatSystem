package com.chatsystem.ChatSystem.repository;

import com.chatsystem.ChatSystem.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ConversationRepository extends JpaRepository <Conversation , String>{



    @Query("""
       SELECT c 
       FROM Conversation c 
       WHERE c.type = 'DM' 
         AND SIZE(c.participants) = 2 
         AND EXISTS (SELECT 1 FROM ConversationParticipant p1 
                     WHERE p1.conversation = c AND p1.user.id = :user1Id) 
         AND EXISTS (SELECT 1 FROM ConversationParticipant p2 
                     WHERE p2.conversation = c AND p2.user.id = :user2Id)
       """)
    Optional<Conversation> findDMConversation(@Param("user1Id") String user1Id,
                                              @Param("user2Id") String user2Id);

    @Query("SELECT c FROM Conversation c JOIN c.participants p JOIN p.user u WHERE u.id = :userId ORDER BY c.lastMessageAt DESC")
    List<Conversation> findAllByUserId(@Param("userId") String userId);

}
