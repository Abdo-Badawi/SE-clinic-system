package com.clinic.auth.service.impl;

import com.clinic.auth.client.DoctorServiceClient;
import com.clinic.auth.client.PatientServiceClient;
import com.clinic.auth.model.entity.User;
import com.clinic.auth.service.AuthService;
import com.clinic.auth.service.UserService;
import com.clinic.common.dto.request.LoginRequest;
import com.clinic.common.dto.request.RegisterRequest;
import com.clinic.common.dto.response.JwtResponse;
import com.clinic.common.exception.BadRequestException;
import com.clinic.common.exception.UnauthorizedException;
import com.clinic.common.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PatientServiceClient patientServiceClient;
    private final DoctorServiceClient doctorServiceClient;

    @Override
    public JwtResponse login(LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return new JwtResponse(token, "Bearer", user.getId(), user.getEmail(),
                user.getFullName(), user.getRole().name());
    }

    @Override
    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.UserRole.valueOf(request.getRole().toUpperCase()))
                .isActive(true)
                .build();

        User savedUser = userService.createUser(user);

        // Temporarily disabled for standalone testing
        log.info("Skipping profile creation for user {} (patient/doctor service not running)",
                savedUser.getId());

        // TODO: Uncomment when patient/doctor services are ready
        /*
        try {
            if (savedUser.getRole() == User.UserRole.PATIENT) {
                CreatePatientRequest patientRequest = CreatePatientRequest.builder()
                        .userId(savedUser.getId())
                        .email(savedUser.getEmail())
                        .fullName(savedUser.getFullName())
                        .phone(request.getPhone())
                        .address(request.getAddress())
                        .build();
                patientServiceClient.createPatient(patientRequest);
            } else if (savedUser.getRole() == User.UserRole.DOCTOR) {
                CreateDoctorRequest doctorRequest = CreateDoctorRequest.builder()
                        .userId(savedUser.getId())
                        .email(savedUser.getEmail())
                        .fullName(savedUser.getFullName())
                        .specialization(request.getSpecialization())
                        .build();
                doctorServiceClient.createDoctor(doctorRequest);
            }
        } catch (Exception e) {
            log.error("Failed to create profile for user {}: {}", savedUser.getId(), e.getMessage());
            throw new RuntimeException("User created but profile creation failed. Please contact admin.");
        }
        */

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(),
                savedUser.getRole().name());
        return new JwtResponse(token, "Bearer", savedUser.getId(), savedUser.getEmail(),
                savedUser.getFullName(), savedUser.getRole().name());
    }

    @Override
    public void validateToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
}