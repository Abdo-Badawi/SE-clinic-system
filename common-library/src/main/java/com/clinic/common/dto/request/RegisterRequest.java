package com.clinic.common.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be blank")
    private String email;
    
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password should be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Full name cannot be blank")
    private String fullName;
    
    @NotBlank(message = "Role cannot be blank")
    private String role; // ADMIN, DOCTOR, PATIENT, RECEPTIONIST
    
    // Additional fields based on role
    private String phone;
    private String address;
    private String specialization; // for DOCTOR role
}
