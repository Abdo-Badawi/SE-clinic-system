package com.clinic.medicalrecord.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponse {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private Long appointmentId;
    private LocalDateTime visitDate;
    private String diagnosis;
    private String prescription;
    private String notes;
    private String attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}