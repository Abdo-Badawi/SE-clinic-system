package com.clinic.medicalrecord.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordRequest {
    @NotNull
    private Long patientId;
    private Long appointmentId;
    private LocalDateTime visitDate;
    private String diagnosis;
    private String prescription;
    private String notes;
    private String attachments;
}