package com.clinic.doctor.repository;

import com.clinic.doctor.model.entity.Doctor;

import feign.Param;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    @Modifying
    @Query(value = "UPDATE users SET is_active = false WHERE id = :id", nativeQuery = true)
    void deactivateUser(@Param("id") Long id);
    @Query(value = "SELECT d.id, d.specialization, u.is_active " +
               "FROM doctors d JOIN users u ON d.id = u.id " +
               "ORDER BY d.id", nativeQuery = true)
List<Object[]> findDoctorsWithUserStatus();
}