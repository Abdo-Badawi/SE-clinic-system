package com.clinic.patient.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePatientRequest {
    private String phone;
    private String address;
    private String emergencyContact;
    private String medicalSummary;
}