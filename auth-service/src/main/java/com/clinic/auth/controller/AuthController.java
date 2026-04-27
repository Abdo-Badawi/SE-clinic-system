package com.clinic.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.auth.service.AuthService;
import com.clinic.auth.service.UserService;
import com.clinic.common.annotation.Loggable;
import com.clinic.common.dto.request.LoginRequest;
import com.clinic.common.dto.request.RegisterRequest;
import com.clinic.common.dto.response.JwtResponse;
import com.clinic.common.dto.response.UserResponse;
import com.clinic.common.exception.BadRequestException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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

    @PostMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Loggable
    public ResponseEntity<JwtResponse> createUser(@Valid @RequestBody RegisterRequest request) {
        if (request.getRole() == null || request.getRole().isBlank()) {
            throw new BadRequestException("Role is required for admin user creation");
        }
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/register")
public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
    request.setRole("PATIENT");
    return ResponseEntity.ok(authService.register(request));
}

    @GetMapping("/validate")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        authService.validateToken(token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/internal/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}