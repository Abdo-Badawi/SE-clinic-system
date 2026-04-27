package com.clinic.patient.service.impl;

import com.clinic.common.annotation.Loggable;
import com.clinic.common.exception.BadRequestException;
import com.clinic.common.exception.ResourceNotFoundException;
import com.clinic.patient.client.AuthClient;
import com.clinic.patient.dto.request.CreatePatientRequest;
import com.clinic.patient.dto.request.UpdatePatientRequest;
import com.clinic.patient.dto.response.PatientResponse;
import com.clinic.patient.model.entity.Patient;
import com.clinic.patient.repository.PatientRepository;
import com.clinic.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final AuthClient authClient;

    @Override
    @Transactional
    @Loggable
    public PatientResponse createPatient(CreatePatientRequest request) {
        // Validate user exists in auth-service
        // try {
        //     authClient.getUserById(request.getUserId());
        // } catch (Exception e) {
        //     log.error("User with ID {} not found in auth-service", request.getUserId());
        //     throw new BadRequestException("User with ID " + request.getUserId() + " does not exist.");
        // }

        if (patientRepository.existsById(request.getUserId())) {
        throw new BadRequestException("Patient profile already exists for user ID: " + request.getUserId());
    }

        Patient patient = Patient.builder()
                .id(request.getUserId())
                .dateOfBirth(request.getDateOfBirth())
                .phone(request.getPhone())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .medicalSummary(request.getMedicalSummary())
                .build();

        Patient savedPatient = patientRepository.save(patient);
        log.info("Patient profile created for user ID: {}", savedPatient.getId());
        return mapToResponse(savedPatient);
    }

    @Override
    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        return mapToResponse(patient);
    }

    @Override
    @Transactional
    public PatientResponse updatePatient(Long id, UpdatePatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));

        if (request.getPhone() != null) patient.setPhone(request.getPhone());
        if (request.getAddress() != null) patient.setAddress(request.getAddress());
        if (request.getEmergencyContact() != null) patient.setEmergencyContact(request.getEmergencyContact());
        if (request.getMedicalSummary() != null) patient.setMedicalSummary(request.getMedicalSummary());

        Patient updatedPatient = patientRepository.save(patient);
        log.info("Patient profile updated for user ID: {}", updatedPatient.getId());
        return mapToResponse(updatedPatient);
    }

    @Override
    @Transactional
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient", "id", id);
        }
        patientRepository.deleteById(id);
        log.info("Patient profile deleted for user ID: {}", id);
    }

    private PatientResponse mapToResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .dateOfBirth(patient.getDateOfBirth())
                .phone(patient.getPhone())
                .address(patient.getAddress())
                .emergencyContact(patient.getEmergencyContact())
                .medicalSummary(patient.getMedicalSummary())
                .createdAt(patient.getCreatedAt())
                .updatedAt(patient.getUpdatedAt())
                .build();
    }
}