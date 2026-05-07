package com.clinic.appointment.dto.request;

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
public class AvailableSlotsRequest {
    @NotNull
    private Long doctorId;
    @NotNull
    private LocalDate date;
}