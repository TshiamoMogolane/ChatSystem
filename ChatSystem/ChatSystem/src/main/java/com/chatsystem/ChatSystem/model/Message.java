package com.chatsystem.ChatSystem.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
@Entity
public class Message {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id" , nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id" , nullable = false)
    private User sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private MessageType type = MessageType.TEXT;

    private String attachmentUrl;

    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Message() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Message{" +
                "id='" + id + '\'' +
                ", conversation=" + conversation +
                ", sender=" + sender +
                ", content='" + content + '\'' +
                ", type=" + type +
                ", attachmentUrl='" + attachmentUrl + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    public enum MessageType{
        TEXT , IMAGE , FILE , SYSTEM
    }

}
