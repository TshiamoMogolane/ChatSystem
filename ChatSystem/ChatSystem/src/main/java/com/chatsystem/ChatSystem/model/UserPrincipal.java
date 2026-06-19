package com.chatsystem.ChatSystem.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 *
 */
public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Spring Security expects roles to be prefixed with "ROLE_" by convention
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // ✅ THIS IS THE METHOD THAT CONTROLS THE "DISABLED" STATE
    @Override
    public boolean isEnabled() {
        // If this returns FALSE, Spring throws DisabledException on login.
        // You need a field in your User entity to control this.
        return user.isEnabled(); // 👈 This must exist in your 'User' class
    }
}
