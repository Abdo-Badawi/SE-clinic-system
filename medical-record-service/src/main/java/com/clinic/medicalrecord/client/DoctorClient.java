package com.clinic.medicalrecord.client;

import com.clinic.common.dto.response.DoctorResponse;
import com.clinic.medicalrecord.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "doctor-service", url = "${doctor.service.url:http://doctor-service}", configuration = FeignConfig.class)
public interface DoctorClient {
    @GetMapping("/api/doctors/{id}")
    DoctorResponse getDoctorById(@PathVariable("id") Long id);
}