package com.clinic.appointment.controller;

import com.clinic.appointment.dto.request.AppointmentRequest;
import com.clinic.appointment.dto.request.AvailableSlotsRequest;
import com.clinic.appointment.dto.request.CancelAppointmentRequest;
import com.clinic.appointment.dto.request.UpdateAppointmentStatusRequest;
import com.clinic.appointment.dto.response.AppointmentResponse;
import com.clinic.appointment.dto.response.AvailableSlotResponse;
import com.clinic.appointment.service.AppointmentService;
import com.clinic.common.annotation.Auditable;

import com.clinic.common.annotation.Loggable;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.clinic.common.exception.ForbiddenException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @Loggable
    // @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('ADMIN') or
    // hasRole('PATIENT')")
    @Auditable(action = "BOOK_APPOINTMENT", entityType = "Appointment")
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            HttpServletRequest httpRequest) {
        Long createdBy = (Long) httpRequest.getAttribute("userId");
        return new ResponseEntity<>(appointmentService.createAppointment(request, createdBy), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping("/patient/{patientId}")
@PreAuthorize("hasAuthority('ROLE_PATIENT') or hasAuthority('ROLE_DOCTOR') or hasAuthority('ROLE_RECEPTIONIST') or hasAuthority('ROLE_ADMIN')")
public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatient(
        @PathVariable("patientId") Long patientId,
        HttpServletRequest request) {

    Long loggedInUserId = (Long) request.getAttribute("userId");
    String role = (String) request.getAttribute("role");

    // Patient can only view their own appointments
    if ("PATIENT".equalsIgnoreCase(role) && !loggedInUserId.equals(patientId)) {
        throw new ForbiddenException("You can only view your own appointments");
    }

    return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
}

    @GetMapping("/doctor/{doctorId}")
@PreAuthorize("hasAuthority('ROLE_DOCTOR') or hasAuthority('ROLE_RECEPTIONIST') or hasAuthority('ROLE_ADMIN')")
public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctor(
        @PathVariable("doctorId") Long doctorId,
        HttpServletRequest request) {

    Long loggedInUserId = (Long) request.getAttribute("userId");
    String role = (String) request.getAttribute("role");

    // Doctor can only fetch their own schedule
    if ("DOCTOR".equalsIgnoreCase(role) && !loggedInUserId.equals(doctorId)) {
        throw new ForbiddenException("You can only view your own schedule");
    }

    return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
}

    @GetMapping("/doctor/{doctorId}/date")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctorAndDate(
            @PathVariable("doctorId") Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorAndDate(doctorId, date));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('ADMIN') or hasRole('DOCTOR')")
    @Auditable(action = "UPDATE_APPOINTMENT_STATUS", entityType = "Appointment")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateAppointmentStatusRequest request,
            HttpServletRequest httpRequest) {
        Long updatedBy = (Long) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, request, updatedBy));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('ADMIN') or hasRole('PATIENT')")
    @Auditable(action = "CANCEL_APPOINTMENT", entityType = "Appointment")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable("id") Long id,
            @Valid @RequestBody CancelAppointmentRequest request,
            HttpServletRequest httpRequest) {
        Long cancelledBy = (Long) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, request.getReason(), cancelledBy));
    }

    @PostMapping("/available-slots")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlots(
            @Valid @RequestBody AvailableSlotsRequest request) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('ADMIN')")
    @Auditable(action = "DELETE_APPOINTMENT", entityType = "Appointment")
    public ResponseEntity<Void> deleteAppointment(@PathVariable("id") Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}