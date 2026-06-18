package com.chatsystem.ChatSystem.dto;

import java.time.LocalDateTime;

public class MessageRequest {

    private String text;

    private String reactString;

    private LocalDateTime sentAt;

    public MessageRequest(String text, String reactString, LocalDateTime sentAt) {
        this.text = text;
        this.reactString = reactString;
        this.sentAt = sentAt;
    }

    public MessageRequest() {
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getReactString() {
        return reactString;
    }

    public void setReactString(String reactString) {
        this.reactString = reactString;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    @Override
    public String toString() {
        return "MessageRequest{" +
                "text='" + text + '\'' +
                ", reactString='" + reactString + '\'' +
                ", sentAt=" + sentAt +
                '}';
    }
}
