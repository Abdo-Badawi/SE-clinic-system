package com.clinic.auth.controller;

import com.clinic.auth.service.AuthService;
import com.clinic.auth.service.UserService;
import com.clinic.common.annotation.Loggable;
import com.clinic.common.dto.request.LoginRequest;
import com.clinic.common.dto.request.RegisterRequest;
import com.clinic.common.dto.response.JwtResponse;
import com.clinic.common.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    @Loggable
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @Loggable
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // Internal endpoint for other services to validate token
    @GetMapping("/validate")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        authService.validateToken(token);
        return ResponseEntity.ok().build();
    }

    // Internal endpoint to get user by ID (used by other services)
    @GetMapping("/internal/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}