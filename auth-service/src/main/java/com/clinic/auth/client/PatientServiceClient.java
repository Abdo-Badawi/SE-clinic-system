package com.clinic.auth.client;

import com.clinic.auth.config.FeignConfig;
import com.clinic.common.dto.request.CreatePatientRequest;
import com.clinic.common.dto.response.PatientResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "patient-service",
    url = "${patient.service.url:http://patient-service}",
    configuration = FeignConfig.class
)
public interface PatientServiceClient {

    @PostMapping("/api/patients")
    PatientResponse createPatient(@RequestBody CreatePatientRequest request);
}