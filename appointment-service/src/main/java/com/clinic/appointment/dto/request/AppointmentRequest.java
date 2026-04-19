package com.clinic.appointment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    @NotNull
    private Long patientId;
    @NotNull
    private Long doctorId;
    @NotNull
    private LocalDate appointmentDate;
    @NotNull
    private LocalTime startTime;
    private LocalTime endTime;
}