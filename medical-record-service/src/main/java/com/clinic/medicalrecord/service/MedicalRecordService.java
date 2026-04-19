package com.clinic.medicalrecord.service;

import com.clinic.medicalrecord.dto.request.MedicalRecordRequest;
import com.clinic.medicalrecord.dto.request.UpdateMedicalRecordRequest;
import com.clinic.medicalrecord.dto.response.MedicalRecordResponse;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request, Long doctorId);
    MedicalRecordResponse getMedicalRecordById(Long id);
    List<MedicalRecordResponse> getMedicalRecordsByPatient(Long patientId);
    List<MedicalRecordResponse> getMedicalRecordsByDoctor(Long doctorId);
    MedicalRecordResponse updateMedicalRecord(Long id, UpdateMedicalRecordRequest request, Long doctorId);
    void deleteMedicalRecord(Long id);
}