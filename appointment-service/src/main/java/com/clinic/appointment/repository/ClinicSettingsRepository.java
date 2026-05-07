package com.clinic.appointment.repository;

import com.clinic.appointment.model.entity.ClinicSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicSettingsRepository extends JpaRepository<ClinicSettings, Boolean> {
}