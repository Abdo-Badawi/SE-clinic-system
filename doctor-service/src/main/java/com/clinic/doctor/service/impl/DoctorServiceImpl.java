package com.clinic.doctor.service.impl;

import com.clinic.common.annotation.Loggable;
import com.clinic.common.exception.BadRequestException;
import com.clinic.common.exception.ResourceNotFoundException;
import com.clinic.doctor.client.AuthClient;
import com.clinic.doctor.dto.request.CreateDoctorRequest;
import com.clinic.doctor.dto.request.UpdateDoctorRequest;
import com.clinic.doctor.dto.response.DoctorResponse;
import com.clinic.doctor.model.entity.Doctor;
import com.clinic.doctor.repository.DoctorRepository;
import com.clinic.doctor.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final AuthClient authClient;

    @Override
    @Transactional
    @Loggable
    public DoctorResponse createDoctor(CreateDoctorRequest request) {
        // Validate user exists in auth-service
        // try {
        //     authClient.getUserById(request.getUserId());
        // } catch (Exception e) {
        //     log.error("User with ID {} not found in auth-service", request.getUserId());
        //     throw new BadRequestException("User with ID " + request.getUserId() + " does not exist.");
        // }

        if (doctorRepository.existsById(request.getUserId())) {
            throw new BadRequestException("Doctor profile already exists for user ID: " + request.getUserId());
        }

        Doctor doctor = Doctor.builder()
                .id(request.getUserId())
                .specialization(request.getSpecialization())
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        log.info("Doctor profile created for user ID: {}", savedDoctor.getId());
        return mapToResponse(savedDoctor);
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        return mapToResponse(doctor);
    }

    @Override
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DoctorResponse updateDoctor(Long id, UpdateDoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));

        if (request.getSpecialization() != null) {
            doctor.setSpecialization(request.getSpecialization());
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        log.info("Doctor profile updated for user ID: {}", updatedDoctor.getId());
        return mapToResponse(updatedDoctor);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        doctorRepository.deleteById(id);
        log.info("Doctor profile deleted for user ID: {}", id);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .specialization(doctor.getSpecialization())
                .createdAt(doctor.getCreatedAt())
                .updatedAt(doctor.getUpdatedAt())
                .build();
    }
}