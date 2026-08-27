package com.chatsystem.ChatSystem.dto;

public class UpdateProfileDTO {


    private String bio;

    public UpdateProfileDTO(String bio) {
        this.bio = bio;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

}
