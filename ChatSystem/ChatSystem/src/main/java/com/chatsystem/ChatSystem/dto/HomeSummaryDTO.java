package com.chatsystem.ChatSystem.dto;

import java.util.List;

public class HomeSummaryDTO {
    private int pendingCount;
    private List<FriendResponseDTO> pending;
    private int suggestionsCount;
    private List<FriendResponseDTO> suggestions;

    // Getters and setters


    public HomeSummaryDTO(int pendingCount, List<FriendResponseDTO> pending, int suggestionsCount, List<FriendResponseDTO> suggestions) {
        this.pendingCount = pendingCount;
        this.pending = pending;
        this.suggestionsCount = suggestionsCount;
        this.suggestions = suggestions;
    }

    public int getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(int pendingCount) {
        this.pendingCount = pendingCount;
    }

    public List<FriendResponseDTO> getPending() {
        return pending;
    }

    public void setPending(List<FriendResponseDTO> pending) {
        this.pending = pending;
    }

    public int getSuggestionsCount() {
        return suggestionsCount;
    }

    public void setSuggestionsCount(int suggestionsCount) {
        this.suggestionsCount = suggestionsCount;
    }

    public List<FriendResponseDTO> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<FriendResponseDTO> suggestions) {
        this.suggestions = suggestions;
    }

    public HomeSummaryDTO() {
    }

    @Override
    public String toString() {
        return "HomeSummaryDTO{" +
                "pendingCount=" + pendingCount +
                ", pending=" + pending +
                ", suggestionsCount=" + suggestionsCount +
                ", suggestions=" + suggestions +
                '}';
    }
}

