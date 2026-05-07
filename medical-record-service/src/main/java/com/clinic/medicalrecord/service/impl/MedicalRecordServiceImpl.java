package com.clinic.medicalrecord.service.impl;

import com.clinic.common.annotation.Loggable;
import com.clinic.common.exception.BadRequestException;
import com.clinic.common.exception.ForbiddenException;
import com.clinic.common.exception.ResourceNotFoundException;
import com.clinic.medicalrecord.client.AppointmentClient;
import com.clinic.medicalrecord.client.DoctorClient;
import com.clinic.medicalrecord.client.PatientClient;
import com.clinic.medicalrecord.dto.request.MedicalRecordRequest;
import com.clinic.medicalrecord.dto.request.UpdateMedicalRecordRequest;
import com.clinic.medicalrecord.dto.response.AppointmentResponse;
import com.clinic.medicalrecord.dto.response.MedicalRecordResponse;
import com.clinic.medicalrecord.model.entity.MedicalRecord;
import com.clinic.medicalrecord.repository.MedicalRecordRepository;
import com.clinic.medicalrecord.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;
    private final AppointmentClient appointmentClient;

    @Override
    @Transactional
    @Loggable
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request, Long doctorId) {
        // Validate patient exists
        try {
            patientClient.getPatientById(request.getPatientId());
        } catch (Exception e) {
            log.error("Patient with ID {} not found", request.getPatientId());
            throw new BadRequestException("Patient with ID " + request.getPatientId() + " does not exist");
        }

        // Validate doctor exists
        try {
            doctorClient.getDoctorById(doctorId);
        } catch (Exception e) {
            log.error("Doctor with ID {} not found", doctorId);
            throw new BadRequestException("Doctor with ID " + doctorId + " does not exist");
        }

        // If appointment ID is provided, validate it
        if (request.getAppointmentId() != null) {
            try {
                AppointmentResponse appointment = appointmentClient.getAppointmentById(request.getAppointmentId());

                if (!appointment.getPatientId().equals(request.getPatientId())) {
                    throw new BadRequestException("Appointment does not belong to this patient");
                }

                if (!appointment.getDoctorId().equals(doctorId)) {
                    throw new BadRequestException("Appointment does not belong to this doctor");
                }

                if (!"completed".equalsIgnoreCase(appointment.getStatus())) {
                    throw new BadRequestException("Medical records can only be created for completed appointments");
                }
            } catch (BadRequestException e) {
                throw e;
            } catch (Exception e) {
                log.error("Appointment with ID {} not found", request.getAppointmentId());
                throw new BadRequestException("Appointment with ID " + request.getAppointmentId() + " does not exist");
            }
        }

        MedicalRecord record = MedicalRecord.builder()
                .patientId(request.getPatientId())
                .doctorId(doctorId)
                .appointmentId(request.getAppointmentId())
                .visitDate(request.getVisitDate() != null ? request.getVisitDate() : LocalDateTime.now())
                .diagnosis(request.getDiagnosis())
                .prescription(request.getPrescription())
                .notes(request.getNotes())
                .attachments(request.getAttachments())
                .build();

        MedicalRecord saved = medicalRecordRepository.save(record);
        log.info("Medical record created: ID {}, Patient {}, Doctor {}",
                saved.getId(), saved.getPatientId(), saved.getDoctorId());

        return mapToResponse(saved);
    }

    @Override
    public MedicalRecordResponse getMedicalRecordById(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", "id", id));
        return mapToResponse(record);
    }

    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByPatient(Long patientId) {
        try {
            patientClient.getPatientById(patientId);
        } catch (Exception e) {
            throw new BadRequestException("Patient with ID " + patientId + " does not exist");
        }

        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByDoctor(Long doctorId) {
        try {
            doctorClient.getDoctorById(doctorId);
        } catch (Exception e) {
            throw new BadRequestException("Doctor with ID " + doctorId + " does not exist");
        }

        return medicalRecordRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MedicalRecordResponse updateMedicalRecord(Long id, UpdateMedicalRecordRequest request, Long doctorId) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", "id", id));

        if (!record.getDoctorId().equals(doctorId)) {
            throw new ForbiddenException("You are not authorized to update this medical record");
        }

        if (request.getDiagnosis() != null) record.setDiagnosis(request.getDiagnosis());
        if (request.getPrescription() != null) record.setPrescription(request.getPrescription());
        if (request.getNotes() != null) record.setNotes(request.getNotes());
        if (request.getAttachments() != null) record.setAttachments(request.getAttachments());

        MedicalRecord updated = medicalRecordRepository.save(record);
        log.info("Medical record updated: ID {}", updated.getId());

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMedicalRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("MedicalRecord", "id", id);
        }
        medicalRecordRepository.deleteById(id);
        log.info("Medical record deleted: ID {}", id);
    }

    private MedicalRecordResponse mapToResponse(MedicalRecord record) {
        return MedicalRecordResponse.builder()
                .id(record.getId())
                .patientId(record.getPatientId())
                .doctorId(record.getDoctorId())
                .appointmentId(record.getAppointmentId())
                .visitDate(record.getVisitDate())
                .diagnosis(record.getDiagnosis())
                .prescription(record.getPrescription())
                .notes(record.getNotes())
                .attachments(record.getAttachments())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}