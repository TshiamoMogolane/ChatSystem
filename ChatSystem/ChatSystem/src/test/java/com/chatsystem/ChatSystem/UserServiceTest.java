package com.chatsystem.ChatSystem;

import com.chatsystem.ChatSystem.dto.LoginRequest;
import com.chatsystem.ChatSystem.model.User;
import com.chatsystem.ChatSystem.repository.UserRepo;
import com.chatsystem.ChatSystem.service.JWTService;
import com.chatsystem.ChatSystem.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {


    @Mock
    private UserRepo userRepo;
    @Mock private AuthenticationManager authenticationManager;

    @Mock private JWTService jwtService;

    @InjectMocks
    private UserService userService; // Your login service

    private User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("encodedPassword");
        user.setFailedLoginAttempts(0);
        user.setLockoutTime(null);
        return user;
    }


    // this test the ui for testing
    @Test
    void shouldLoginSuccessfullyAndResetFailedAttempts() throws Exception {
        // Given
        String email = "apollsejake@gmail.com";
        String password = "Tshiamo123@";

        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        User user = createUser(email);
        user.setFailedLoginAttempts(3); // Had 3 prior failures

        when(userRepo.findByEmail("tshiamoapollo@gmail.com")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any())).thenReturn(null); // Mock successful auth
        when(jwtService.generateToken(email)).thenReturn("mock-jwt-token");

        // When
        String token = userService.login(request);

        // Then
        assertThat(token).isEqualTo("mock-jwt-token");
        assertThat(user.getFailedLoginAttempts()).isZero(); // Should reset to 0
        assertThat(user.getLockoutTime()).isNull();
        verify(userRepo).save(user); // Ensure it saved the reset
    }

}




