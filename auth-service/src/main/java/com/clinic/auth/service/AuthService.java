package com.clinic.auth.service;

import com.clinic.common.dto.request.LoginRequest;
import com.clinic.common.dto.request.RegisterRequest;
import com.clinic.common.dto.response.JwtResponse;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    JwtResponse register(RegisterRequest request);
    void validateToken(String token);
}