package com.clinic.medicalrecord.controller;

import com.clinic.common.annotation.Loggable;
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

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    @Loggable
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('PATIENT') and #patientId == authentication.principal.id or hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('RECEPTIONIST')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatient(@PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR') and #doctorId == authentication.principal.id or hasRole('ADMIN') or hasRole('RECEPTIONIST')")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDoctor(@PathVariable("doctorId") Long doctorId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByDoctor(doctorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateMedicalRecordRequest request,
            HttpServletRequest httpRequest) {
        Long doctorId = (Long) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(medicalRecordService.updateMedicalRecord(id, request, doctorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable("id") Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
}