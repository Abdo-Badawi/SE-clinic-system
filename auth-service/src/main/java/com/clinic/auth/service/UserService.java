package com.clinic.auth.service;

import com.clinic.auth.model.entity.User;
import com.clinic.common.dto.response.UserResponse;

import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    UserResponse getUserById(Long id);
    boolean existsByEmail(String email);
}