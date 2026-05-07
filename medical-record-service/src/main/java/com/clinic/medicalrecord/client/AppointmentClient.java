package com.clinic.medicalrecord.client;

import com.clinic.medicalrecord.config.FeignConfig;
import com.clinic.medicalrecord.dto.response.AppointmentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "appointment-service", url = "${appointment.service.url:http://appointment-service}", configuration = FeignConfig.class)
public interface AppointmentClient {
    @GetMapping("/api/appointments/{id}")
    AppointmentResponse getAppointmentById(@PathVariable("id") Long id);
}