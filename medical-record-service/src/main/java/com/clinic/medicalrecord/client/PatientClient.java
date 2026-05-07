package com.clinic.medicalrecord.client;

import com.clinic.common.dto.response.PatientResponse;
import com.clinic.medicalrecord.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "patient-service", url = "${patient.service.url:http://patient-service}", configuration = FeignConfig.class)
public interface PatientClient {
    @GetMapping("/api/patients/{id}")
    PatientResponse getPatientById(@PathVariable("id") Long id);
}