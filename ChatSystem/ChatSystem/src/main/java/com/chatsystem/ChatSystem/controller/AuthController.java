package com.chatsystem.ChatSystem.controller;

import com.chatsystem.ChatSystem.dto.*;
import com.chatsystem.ChatSystem.exception.AlreadyFoundException;
import com.chatsystem.ChatSystem.exception.NotFoundException;
import com.chatsystem.ChatSystem.exception.ServerException;
import com.chatsystem.ChatSystem.service.UserService;
import org.antlr.v4.runtime.InputMismatchException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private Logger logger = LoggerFactory.getLogger(AuthController.class);

    private UserService userService;

    public AuthController(UserService userService){

        this.userService = userService;

    }

    //login api
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        try {

            //login function
            logger.info("Performing login function");
            //login function frm UserService class
            String token = userService.login(loginRequest);

            ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .sameSite("Lax")
                    .build();
            logger.info("Successfully logged");

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body("Login Successful");

        }catch(DisabledException ex){
            logger.error("Your account has disabled ");
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        } catch(BadCredentialsException ex){
            logger.error("Invalid credentials");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch(Exception ex){
            logger.error("Something went wrong with the server",ex);
            return new ResponseEntity<>(HttpStatus
                    .INTERNAL_SERVER_ERROR);
        }


    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok().body(Map.of("message", "Password reset successful."));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (ServerException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error. Please try again."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody SignUpRequest signUpRequest){
        try{

            userService.signup(signUpRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(ServerException serverException){
            logger.error("something went wrong with the server");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (AlreadyFoundException e) {
            logger.error("User already exist");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verifyOpt(@RequestBody VerifyRequest verifyRequest){
        try{

            userService.Verify(verifyRequest.getEmail(), verifyRequest.getOtp());
            return new ResponseEntity<>(HttpStatus.OK);

        }catch(NotFoundException notFoundException){
            logger.error("User expired",notFoundException);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        }catch(InputMismatchException inputMismatchException){
            logger.error("Invalid code",inputMismatchException);
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }catch(Exception exception){
            logger.error("Something went wrong with the server",exception);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody EmailRequest email){

        try{

            userService.forgotPassword(email.getEmail());
            return new ResponseEntity<>(HttpStatus.OK);

        }catch(Exception exception){

            logger.error("Something went wrong with the server ",exception);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }

}
