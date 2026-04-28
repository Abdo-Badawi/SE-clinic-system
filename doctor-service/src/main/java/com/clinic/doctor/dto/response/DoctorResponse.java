package com.clinic.doctor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private String specialization;
      private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}