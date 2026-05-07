package com.clinic.appointment.service;

import com.clinic.appointment.dto.request.AppointmentRequest;
import com.clinic.appointment.dto.request.AvailableSlotsRequest;
import com.clinic.appointment.dto.request.UpdateAppointmentStatusRequest;
import com.clinic.appointment.dto.response.AppointmentResponse;
import com.clinic.appointment.dto.response.AvailableSlotResponse;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse createAppointment(AppointmentRequest request, Long createdBy);
    AppointmentResponse getAppointmentById(Long id);
    List<AppointmentResponse> getAppointmentsByPatient(Long patientId);
    List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId);
    List<AppointmentResponse> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date);
    AppointmentResponse updateAppointmentStatus(Long id, UpdateAppointmentStatusRequest request, Long updatedBy);
    AppointmentResponse cancelAppointment(Long id, String reason, Long cancelledBy);
    List<AvailableSlotResponse> getAvailableSlots(AvailableSlotsRequest request);
    void deleteAppointment(Long id);
}