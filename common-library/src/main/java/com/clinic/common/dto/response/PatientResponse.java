package com.clinic.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String emergencyContact;
    private String medicalSummary;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
