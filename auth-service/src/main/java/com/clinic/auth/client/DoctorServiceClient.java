package com.clinic.auth.client;

import com.clinic.auth.config.FeignConfig;
import com.clinic.common.dto.request.CreateDoctorRequest;
import com.clinic.common.dto.response.DoctorResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "doctor-service",
    url = "${doctor.service.url:http://doctor-service}",
    configuration = FeignConfig.class
)
public interface DoctorServiceClient {

    @PostMapping("/api/doctors")
    DoctorResponse createDoctor(@RequestBody CreateDoctorRequest request);
}