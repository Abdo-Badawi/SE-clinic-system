package com.clinic.patient.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePatientRequest {
    @NotNull
    private Long userId;
    @NotNull
    private String email;
    @NotNull
    private String fullName;
    private String dateOfBirth;
    @NotNull
    private String phone;
    private String address;
    private String emergencyContact;
    private String medicalSummary;
}