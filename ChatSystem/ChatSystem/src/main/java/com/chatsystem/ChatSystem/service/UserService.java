package com.chatsystem.ChatSystem.service;

import com.chatsystem.ChatSystem.dto.LoginRequest;
import com.chatsystem.ChatSystem.dto.PendingUser;
import com.chatsystem.ChatSystem.dto.SignUpRequest;
import com.chatsystem.ChatSystem.exception.AlreadyFoundException;
import com.chatsystem.ChatSystem.exception.NotFoundException;
import com.chatsystem.ChatSystem.exception.ServerException;
import com.chatsystem.ChatSystem.model.PasswordResetToken;
import com.chatsystem.ChatSystem.model.User;
import com.chatsystem.ChatSystem.model.UserPrincipal;
import com.chatsystem.ChatSystem.repository.PasswordResetTokenRepository;
import com.chatsystem.ChatSystem.repository.PendingUserRepository;
import com.chatsystem.ChatSystem.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.InputMismatchException;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;


@Service
public class UserService implements UserDetailsService {

    //instantiation
    @Autowired
    private final UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final String subject = "Lets Chat ";
    private final PendingUserRepository pendingUserRepo;
    private final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    //constructor

    public UserService(JWTService jwtService, @Lazy AuthenticationManager authenticationManager,
                       PasswordResetTokenRepository passwordResetTokenRepository,UserRepo userRepo, JavaMailSender mailSender, PendingUserRepository pendingUserRepo) {
        this.mailSender = mailSender;
        this.userRepo = userRepo;
        this.pendingUserRepo = pendingUserRepo;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    //this function or method does the singUp business logic
    @Transactional
    public void signup(SignUpRequest signUpRequest) throws ServerException,AlreadyFoundException {

        try {

            //request optional user
            Optional<User> optionalUser = userRepo.findByEmail(signUpRequest.getEmail());

            //checks if user exist in the database if yes throws the exception
            if (!optionalUser.isEmpty()) {
                throw new AlreadyFoundException("User already exist with email:" + signUpRequest.getEmail());
            }

            // Check if already pending
            Optional<PendingUser> existingPending = pendingUserRepo.findByEmail(signUpRequest.getEmail());
            if (existingPending.isPresent()) {
                // Optionally delete old pending record, or reuse it with new OTP
                pendingUserRepo.delete(existingPending.get());
            }

            //declaration
            PendingUser pendingUser = new PendingUser();
            //Random number of four numbers
            int codeInt = ThreadLocalRandom.current().nextInt(1000, 10000);

            String code = String.valueOf(codeInt);
            String hashedPassword = passwordEncoder.encode(signUpRequest.getPassword());

            //setting all necessary fields to store the pending users
            pendingUser.setVerificationCode(code);
            pendingUser.setFullNames(signUpRequest.getUsername());
            pendingUser.setEmail(signUpRequest.getEmail());
            pendingUser.setGender(signUpRequest.getGender());
            pendingUser.setHashPassword(hashedPassword);
            pendingUser.setExpiryTimestamp(LocalDateTime.now().plusMinutes(5)); // 10 min

            // send Otp for verification
            sendEmail(signUpRequest.getEmail(), subject,"Please kindly find your max life "+code);
            //saving the pending user
            pendingUserRepo.save(pendingUser);
        } catch (Exception serverException) {
            logger.error("Something went wrong with the server ");
            throw new ServerException("Something went wrong with the server ");

        }

    }


    public String login(LoginRequest loginRequest) throws ServerException {
        try {

            //authentication
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            return jwtService.generateToken(loginRequest.getEmail());

        } catch (Exception e) {

            if (e instanceof AuthenticationException) {
                throw (AuthenticationException) e;
            }

            // ✅ Only wrap genuine server errors (DB down, network failure, etc.)
            logger.error("Server error during login", e);
            throw new ServerException("Something went wrong with the server");
        }
    }
    @Transactional
    public void Verify(String email,String verify)throws NotFoundException, ServerException,InputMismatchException {


        try{
            Optional<PendingUser> optionalPendingUser = pendingUserRepo.findByEmail(email);

            if(optionalPendingUser.isEmpty()){

                logger.error("Pending user not found ");
                throw new NotFoundException("User Expired");

            }

            PendingUser pendingUser = optionalPendingUser.get();
            if(!pendingUser.getVerificationCode().equalsIgnoreCase(verify)){
                logger.error("The opt is not equal the one in the database");
                throw new InputMismatchException("Invalid Opt");
            }

            User user = new User();
            user.setEmail(pendingUser.getEmail());
            user.setCreatedAt(LocalDateTime.now());
            user.setGender(pendingUser.getGender());
            user.setUsername(pendingUser.getFullNames());
            user.setPassword(pendingUser.getHashPassword());
            user.setRole("user");
            userRepo.save(user);


        }catch(Exception exception){
            logger.error("Something went wrong with the server ",exception);
            throw new ServerException("Something went wrong with the server");
        }


    }


    @Transactional
    public void forgotPassword(String email) throws NotFoundException, ServerException {
        try {
            Optional<User> optionalUser = userRepo.findByEmail(email);
            if (optionalUser.isEmpty()) {
                logger.warn("Password reset requested for non-existent email: {}", email);
                return; // security: silent return
            }

            User user = optionalUser.get();

            // ✅ Check if token already exists
            Optional<PasswordResetToken> existingTokenOpt = passwordResetTokenRepository.findByUser(user);

            PasswordResetToken passwordResetToken;
            if (existingTokenOpt.isPresent()) {
                // ✅ UPDATE existing token
                passwordResetToken = existingTokenOpt.get();
                passwordResetToken.setToken(UUID.randomUUID().toString());
                passwordResetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
                logger.info("Updated existing token for user: {}", email);
            } else {
                // ✅ CREATE new token
                passwordResetToken = new PasswordResetToken();
                passwordResetToken.setToken(UUID.randomUUID().toString());
                passwordResetToken.setUser(user);
                passwordResetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
                logger.info("Created new token for user: {}", email);
            }

            // Save (this will be UPDATE if existing, INSERT if new)
            passwordResetTokenRepository.save(passwordResetToken);

            // Send email
            String resetUrl = "http://localhost:5173/reset-password?token=" + passwordResetToken.getToken();
            String emailBody = "Click the link below to reset your password:\n" + resetUrl;
            sendEmail(email, "Chat System Password Reset", emailBody);

            logger.info("Password reset email sent to: {}", email);

        } catch (Exception exception) {
            logger.error("Failed to process forgot password for email: {}", email, exception);
            throw new ServerException("Unable to process password reset request. Please try again.");
        }
    }  private void sendEmail(String emailToSendTo, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailToSendTo);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);

    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User Not found");
        }
        return new UserPrincipal(userOptional.get());
    }



}
