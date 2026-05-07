package com.clinic.doctor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.clinic.doctor.model.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Modifying
    @Query(value = "UPDATE users SET is_active = false WHERE id = :id", nativeQuery = true)
    void deactivateUser(@Param("id") Long id);

    // ✅ single query that includes full name
    @Query(value = "SELECT d.id, d.specialization, u.is_active, u.full_name " +
                   "FROM doctors d JOIN users u ON d.id = u.id " +
                   "ORDER BY d.id", nativeQuery = true)
    List<Object[]> findDoctorsWithUserStatus();
}