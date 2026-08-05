package com.chatsystem.ChatSystem.dto;

public class FriendResponseDTO {
    
    private String Id;
    
    private String name;
    
    private String surname;

    private String connectionId; // 🔥 ADD THIS (only for pending requests)

    private String profilePicture;

    private String status;


    public FriendResponseDTO(String id, String name, String surname) {
        Id = id;
        this.name = name;
        this.surname = surname;
    }


    public FriendResponseDTO(String id, String name, String surname, String profilePicture) {
        Id = id;
        this.name = name;
        this.surname = surname;
        this.profilePicture = profilePicture;
    }

    public FriendResponseDTO(String id, String name, String surname, String connectionId, String profilePicture, String status, String email, boolean online) {
        Id = id;
        this.name = name;
        this.surname = surname;
        this.connectionId = connectionId;
        this.profilePicture = profilePicture;
        this.status = status;
        this.email = email;
        this.online = online;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
    private String email;
    private boolean online;
    // getters & setters


    public String getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(String connectionId) {
        this.connectionId = connectionId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public FriendResponseDTO() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getId() {
        return Id;
    }

    public void setId(String id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    @Override
    public String toString() {
        return "FriendResponseDTO{" +
                "Id='" + Id + '\'' +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", connectionId='" + connectionId + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                ", status='" + status + '\'' +
                ", email='" + email + '\'' +
                ", online=" + online +
                '}';
    }
}
