package com.clinic.doctor.controller;

import com.clinic.common.annotation.Auditable;
import com.clinic.common.annotation.Loggable;
import com.clinic.doctor.dto.request.CreateDoctorRequest;
import com.clinic.doctor.dto.request.UpdateDoctorRequest;
import com.clinic.doctor.dto.response.DoctorResponse;
import com.clinic.doctor.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    @Loggable
    @Auditable(action = "CREATE_DOCTOR", entityType = "Doctor")
    public ResponseEntity<DoctorResponse> createDoctor(@Valid @RequestBody CreateDoctorRequest request) {
        return new ResponseEntity<>(doctorService.createDoctor(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping
    @Auditable(action = "VIEW_ALL_DOCTORS", entityType = "Doctor")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PutMapping("/{id}")
    @Auditable(action = "UPDATE_DOCTOR", entityType = "Doctor")
    
    public ResponseEntity<DoctorResponse> updateDoctor(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateDoctorRequest request) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, request));
    }

    @DeleteMapping("/{id}")
    @Auditable(action = "DEACTIVATE_DOCTOR", entityType = "Doctor")
    public ResponseEntity<Void> deleteDoctor(@PathVariable("id") Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}