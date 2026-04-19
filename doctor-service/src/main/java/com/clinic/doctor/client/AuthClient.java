package com.clinic.doctor.client;

import com.clinic.common.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service", url = "${auth.service.url:http://auth-service}")
public interface AuthClient {
    @GetMapping("/api/auth/internal/users/{id}")
    UserResponse getUserById(@PathVariable("id") Long id);
}