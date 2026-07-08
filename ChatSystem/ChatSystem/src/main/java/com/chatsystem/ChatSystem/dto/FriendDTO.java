package com.chatsystem.ChatSystem.dto;

public class FriendDTO {
    
    private String Id;
    
    private String name;
    
    private String surname;

    public FriendDTO(String id, String name, String surname) {
        Id = id;
        this.name = name;
        this.surname = surname;
    }

    public FriendDTO() {
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
}
