package com.clinic.doctor.service;

import com.clinic.doctor.dto.request.CreateDoctorRequest;
import com.clinic.doctor.dto.request.UpdateDoctorRequest;
import com.clinic.doctor.dto.response.DoctorResponse;

import java.util.List;

public interface DoctorService {
    DoctorResponse createDoctor(CreateDoctorRequest request);
    DoctorResponse getDoctorById(Long id);
    List<DoctorResponse> getAllDoctors();
    DoctorResponse updateDoctor(Long id, UpdateDoctorRequest request);
    void deleteDoctor(Long id);
}