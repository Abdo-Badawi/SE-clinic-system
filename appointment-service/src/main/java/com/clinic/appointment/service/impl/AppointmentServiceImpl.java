package com.clinic.appointment.service.impl;

import com.clinic.appointment.client.DoctorClient;
import com.clinic.appointment.client.PatientClient;
import com.clinic.appointment.dto.request.AppointmentRequest;
import com.clinic.appointment.dto.request.AvailableSlotsRequest;
import com.clinic.appointment.dto.request.UpdateAppointmentStatusRequest;
import com.clinic.appointment.dto.response.AppointmentResponse;
import com.clinic.appointment.dto.response.AvailableSlotResponse;
import com.clinic.appointment.exception.SlotUnavailableException;
import com.clinic.appointment.model.entity.Appointment;
import com.clinic.appointment.model.entity.ClinicSettings;
import com.clinic.appointment.repository.AppointmentRepository;
import com.clinic.appointment.repository.ClinicSettingsRepository;
import com.clinic.appointment.service.AppointmentService;
import com.clinic.common.annotation.Loggable;
import com.clinic.common.exception.BadRequestException;
import com.clinic.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;      // ✅ ADD THIS
import java.time.LocalDateTime;  // ✅ ADD THIS
import java.time.LocalTime;      // ✅ ADD THIS
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ClinicSettingsRepository clinicSettingsRepository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;

    @Override
    @Transactional
    @Loggable
    public AppointmentResponse createAppointment(AppointmentRequest request, Long createdBy) {
        // Validate patient exists
        // try {
        //     patientClient.getPatientById(request.getPatientId());
        // } catch (Exception e) {
        //     throw new BadRequestException("Patient with ID " + request.getPatientId() + " does not exist");
        // }

        // // Validate doctor exists
        // try {
        //     doctorClient.getDoctorById(request.getDoctorId());
        // } catch (Exception e) {
        //     throw new BadRequestException("Doctor with ID " + request.getDoctorId() + " does not exist");
        // }
        
        // 1. Calculate end time
    LocalTime endTime = request.getEndTime();
    if (endTime == null) {
        ClinicSettings settings = getClinicSettings();
        endTime = request.getStartTime().plusMinutes(settings.getSlotDurationMinutes());
    }

    // 2. Check for scheduling conflicts
    if (hasConflict(request.getDoctorId(), request.getAppointmentDate(),
            request.getStartTime(), endTime)) {
        throw new SlotUnavailableException("The requested time slot is already booked");
    }

    // 3. Build and save appointment
    Appointment appointment = Appointment.builder()
            .patientId(request.getPatientId())
            .doctorId(request.getDoctorId())
            .appointmentDate(request.getAppointmentDate())
            .startTime(request.getStartTime())
            .endTime(endTime)
            .status(Appointment.AppointmentStatus.scheduled)
            .createdBy(createdBy)
            .build();

    Appointment saved = appointmentRepository.save(appointment);
    log.info("Appointment created: ID {}, Patient {}, Doctor {}, Date {}",
            saved.getId(), saved.getPatientId(), saved.getDoctorId(), saved.getAppointmentDate());

    return mapToResponse(saved);
}
    @Override
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        return mapToResponse(appointment);
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, UpdateAppointmentStatusRequest request, Long updatedBy) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        appointment.setStatus(Appointment.AppointmentStatus.valueOf(request.getStatus().toLowerCase()));

        if (request.getStatus().equalsIgnoreCase("checked_in")) {
            appointment.setCheckInTime(LocalDateTime.now());
        }

        Appointment updated = appointmentRepository.save(appointment);
        log.info("Appointment {} status updated to {} by user {}", id, request.getStatus(), updatedBy);

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public AppointmentResponse cancelAppointment(Long id, String reason, Long cancelledBy) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        appointment.setStatus(Appointment.AppointmentStatus.cancelled);
        appointment.setCancellationReason(reason);

        Appointment updated = appointmentRepository.save(appointment);
        log.info("Appointment {} cancelled by user {}: {}", id, cancelledBy, reason);

        return mapToResponse(updated);
    }

    @Override
    public List<AvailableSlotResponse> getAvailableSlots(AvailableSlotsRequest request) {
        ClinicSettings settings = getClinicSettings();
        List<Appointment> existingAppointments = appointmentRepository
                .findActiveAppointmentsByDoctorAndDate(request.getDoctorId(), request.getDate());

        List<AvailableSlotResponse> availableSlots = new ArrayList<>();

        LocalTime current = settings.getOpeningTime();
        int slotDuration = settings.getSlotDurationMinutes();

        while (current.isBefore(settings.getClosingTime())) {
            LocalTime slotEnd = current.plusMinutes(slotDuration);
            final LocalTime finalCurrent = current;

            boolean isAvailable = existingAppointments.stream()
                    .noneMatch(a -> a.getStartTime().equals(finalCurrent));

            if (isAvailable) {
                availableSlots.add(AvailableSlotResponse.builder()
                        .startTime(current)
                        .endTime(slotEnd)
                        .available(true)
                        .build());
            }

            current = slotEnd;
        }

        return availableSlots;
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment", "id", id);
        }
        appointmentRepository.deleteById(id);
        log.info("Appointment {} deleted", id);
    }

    private boolean hasConflict(Long doctorId, LocalDate date, LocalTime start, LocalTime end) {
    if (start == null || end == null) {
        throw new IllegalArgumentException("Start time and end time must not be null");
    }
    List<Appointment> existing = appointmentRepository
            .findActiveAppointmentsByDoctorAndDate(doctorId, date);

    return existing.stream().anyMatch(a ->
            start.isBefore(a.getEndTime()) && end.isAfter(a.getStartTime())
    );
}

    private ClinicSettings getClinicSettings() {
        return clinicSettingsRepository.findById(true)
                .orElseThrow(() -> new ResourceNotFoundException("ClinicSettings", "id", true));
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatientId())
                .doctorId(appointment.getDoctorId())
                .appointmentDate(appointment.getAppointmentDate())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .status(appointment.getStatus().name())
                .checkInTime(appointment.getCheckInTime())
                .cancellationReason(appointment.getCancellationReason())
                .createdBy(appointment.getCreatedBy())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt())
                .build();
    }
}