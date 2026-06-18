package com.chatsystem.ChatSystem.dto;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pending_users")
public class PendingUser {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String fullNames;

    private String gender;

    private String email;

    private String hashPassword;

    private String verificationCode;

    private LocalDateTime expiryTimestamp;


    public PendingUser() {
    }

    public String getFullNames() {
        return fullNames;
    }

    public void setFullNames(String fullNames) {
        this.fullNames = fullNames;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHashPassword() {
        return hashPassword;
    }

    public void setHashPassword(String hashPassword) {
        this.hashPassword = hashPassword;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }


    public LocalDateTime getExpiryTimestamp() {
        return expiryTimestamp;
    }

    public void setExpiryTimestamp(LocalDateTime expiryTimestamp) {
        this.expiryTimestamp = expiryTimestamp;
    }

    @Override
    public String toString() {
        return "PendingUser{" +
                "fullNames='" + fullNames + '\'' +
                ", gender='" + gender + '\'' +
                ", email='" + email + '\'' +
                ", hashPassword='" + hashPassword + '\'' +
                ", verificationCode='" + verificationCode + '\'' +
                ", expiryTimestamp=" + expiryTimestamp +
                '}';
    }
}
