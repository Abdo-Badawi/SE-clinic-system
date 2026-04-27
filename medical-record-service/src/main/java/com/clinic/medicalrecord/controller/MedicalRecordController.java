package com.clinic.medicalrecord.controller;

import com.clinic.common.annotation.Loggable;
import com.clinic.common.exception.ForbiddenException;
import com.clinic.medicalrecord.dto.request.MedicalRecordRequest;
import com.clinic.medicalrecord.dto.request.UpdateMedicalRecordRequest;
import com.clinic.medicalrecord.dto.response.MedicalRecordResponse;
import com.clinic.medicalrecord.service.MedicalRecordService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import com.clinic.common.exception.ForbiddenException;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    @Loggable
    @PreAuthorize("hasAuthority('ROLE_DOCTOR') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<MedicalRecordResponse> createMedicalRecord(
            @Valid @RequestBody MedicalRecordRequest request,
            HttpServletRequest httpRequest) {
        Long doctorId = (Long) httpRequest.getAttribute("userId");
        return new ResponseEntity<>(medicalRecordService.createMedicalRecord(request, doctorId), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> getMedicalRecordById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordById(id));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAuthority('ROLE_PATIENT') or hasAuthority('ROLE_DOCTOR') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_RECEPTIONIST')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatient(
            @PathVariable("patientId") Long patientId,
            HttpServletRequest request) {

        Long loggedInUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        if ("PATIENT".equalsIgnoreCase(role) && !loggedInUserId.equals(patientId)) {
            throw new ForbiddenException("You are not authorized to view another patient's records");
        }

        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_RECEPTIONIST')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDoctor(
            @PathVariable("doctorId") Long doctorId,
            HttpServletRequest request) {
        Long loggedInUserId = (Long) request.getAttribute("userId"); // ✅ define this
        String role = (String) request.getAttribute("role");

        if ("DOCTOR".equalsIgnoreCase(role) && !loggedInUserId.equals(doctorId)) {
            throw new ForbiddenException("You are not authorized to view another doctor's records");
        }

        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByDoctor(doctorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateMedicalRecordRequest request,
            HttpServletRequest httpRequest) {
        Long doctorId = (Long) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(medicalRecordService.updateMedicalRecord(id, request, doctorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable("id") Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
}