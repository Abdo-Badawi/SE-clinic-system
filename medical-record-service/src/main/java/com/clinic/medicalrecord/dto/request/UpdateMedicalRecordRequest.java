package com.clinic.medicalrecord.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMedicalRecordRequest {
    private String diagnosis;
    private String prescription;
    private String notes;
    private String attachments;
}