package com.clinic.patient.service;

import com.clinic.patient.dto.request.CreatePatientRequest;
import com.clinic.patient.dto.request.UpdatePatientRequest;
import com.clinic.patient.dto.response.PatientResponse;

public interface PatientService {
    PatientResponse createPatient(CreatePatientRequest request);
    PatientResponse getPatientById(Long id);
    PatientResponse updatePatient(Long id, UpdatePatientRequest request);
    void deletePatient(Long id);
}