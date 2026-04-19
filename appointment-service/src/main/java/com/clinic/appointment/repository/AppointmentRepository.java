package com.clinic.appointment.repository;

import com.clinic.appointment.model.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalTime;   // ✅ ADD THIS
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.appointmentDate = :date AND a.status != 'cancelled'")
    List<Appointment> findActiveAppointmentsByDoctorAndDate(@Param("doctorId") Long doctorId,
                                                            @Param("date") LocalDate date);

    boolean existsByDoctorIdAndAppointmentDateAndStartTimeAndStatusNot(
            Long doctorId, LocalDate date, LocalTime startTime, Appointment.AppointmentStatus status);
}