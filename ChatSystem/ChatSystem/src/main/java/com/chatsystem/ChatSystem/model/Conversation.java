package com.chatsystem.ChatSystem.model;

import jakarta.persistence.*;
import org.hibernate.action.internal.OrphanRemovalAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationType type;

    private String name;

    private String avatorUrl;

    @Column(nullable = false , updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private  LocalDateTime lastMessageAt;
    @OneToMany(mappedBy = "conversation",cascade = CascadeType.ALL , orphanRemoval = true)
    private Set<ConversationParticipant> participants = new HashSet<>();

    @OneToMany(mappedBy = "conversation" , cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<Message> messages = new ArrayList<>();


    public enum ConversationType {
        DM , GROUP
    }

    public Conversation() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ConversationType getType() {
        return type;
    }

    public void setType(ConversationType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatorUrl() {
        return avatorUrl;
    }

    public void setAvatorUrl(String avatorUrl) {
        this.avatorUrl = avatorUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public Set<ConversationParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<ConversationParticipant> participants) {
        this.participants = participants;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}
