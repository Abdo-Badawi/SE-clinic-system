package com.clinic.patient.dto.response;

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
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String emergencyContact;
    private String medicalSummary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}