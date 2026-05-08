package com.clinic.common.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePatientRequest {
   private Long userId;
    private String email;            // optional, not stored in patients table
    private String fullName;         // optional, not stored
    private String dateOfBirth;
    private String phone;
    private String address;
    private String emergencyContact;
    private String medicalSummary;
}
