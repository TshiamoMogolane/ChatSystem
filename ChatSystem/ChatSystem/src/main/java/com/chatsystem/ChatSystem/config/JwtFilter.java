package com.chatsystem.ChatSystem.config;

import com.chatsystem.ChatSystem.service.JWTService;
import com.chatsystem.ChatSystem.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ApplicationContext context;
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("🔍 JwtFilter: processing " + request.getRequestURI());

        // 1️⃣ Read cookie
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println("🍪 Cookie: " + cookie.getName() + "=" + cookie.getValue());
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    System.out.println("✅ Found JWT token: " + token);
                    break;
                }
            }
        } else {
            System.out.println("❌ No cookies in request");
        }

        if (token == null) {
            System.out.println("⚠️ No token – continuing without authentication");
            filterChain.doFilter(request, response);
            return;
        }

        // 2️⃣ Extract username
        String username = null;
        try {
            username = jwtService.extractUserName(token);
            System.out.println("👤 Extracted username: " + username);
        } catch (Exception e) {
            System.out.println("❌ Failed to extract username: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        // 3️⃣ Load user details
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = context.getBean(UserService.class).loadUserByUsername(username);
                System.out.println("👤 Loaded user: " + userDetails.getUsername());

                // 4️⃣ Validate token
                boolean valid = jwtService.validateToken(token, userDetails);
                System.out.println("🔑 Token validation result: " + valid);

                if (valid) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Authentication set for " + username);
                } else {
                    System.out.println("⚠️ Token validation failed");
                }
            } catch (Exception e) {
                System.out.println("❌ Error loading user or validating token: " + e.getMessage());
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}