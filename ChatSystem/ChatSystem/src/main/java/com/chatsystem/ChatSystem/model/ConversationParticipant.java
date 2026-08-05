package com.chatsystem.ChatSystem.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
public class ConversationParticipant {

    @EmbeddedId
    private ConversationParticipantId id  = new ConversationParticipantId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("conversationId")
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime joinedAt = LocalDateTime.now();

    private LocalDateTime lastReadAt; // for unread count

    private boolean isMuted = false;

    private boolean isLeft = false;

    public ConversationParticipant() {
    }

    public ConversationParticipantId getId() {
        return id;
    }

    public void setId(ConversationParticipantId id) {
        this.id = id;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public LocalDateTime getLastReadAt() {
        return lastReadAt;
    }

    public void setLastReadAt(LocalDateTime lastReadAt) {
        this.lastReadAt = lastReadAt;
    }

    public boolean isMuted() {
        return isMuted;
    }

    public void setMuted(boolean muted) {
        isMuted = muted;
    }

    public boolean isLeft() {
        return isLeft;
    }

    public void setLeft(boolean left) {
        isLeft = left;
    }

    @Override
    public String toString() {
        return "ConversationParticipant{" +
                "id=" + id +
                ", conversation=" + conversation +
                ", user=" + user +
                ", joinedAt=" + joinedAt +
                ", lastReadAt=" + lastReadAt +
                ", isMuted=" + isMuted +
                ", isLeft=" + isLeft +
                '}';
    }

    @Embeddable
    public class ConversationParticipantId implements Serializable{

        private String conversationId;

        private String userId;

    }
}




