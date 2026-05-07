package com.clinic.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Value("${AUTH_SERVICE_URL:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${PATIENT_SERVICE_URL:http://localhost:8082}")
    private String patientServiceUrl;

    @Value("${DOCTOR_SERVICE_URL:http://localhost:8083}")
    private String doctorServiceUrl;

    @Value("${APPOINTMENT_SERVICE_URL:http://localhost:8084}")
    private String appointmentServiceUrl;

    @Value("${MEDICAL_RECORD_SERVICE_URL:http://localhost:8085}")
    private String medicalRecordServiceUrl;

    @Value("${AUDIT_SERVICE_URL:http://localhost:8086}")
    private String auditServiceUrl;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri(authServiceUrl))
                .route("patient-service", r -> r
                        .path("/api/patients/**")
                        .uri(patientServiceUrl))
                .route("doctor-service", r -> r
                        .path("/api/doctors/**")
                        .uri(doctorServiceUrl))
                .route("appointment-service", r -> r
                        .path("/api/appointments/**")
                        .uri(appointmentServiceUrl))
                .route("medical-record-service", r -> r
                        .path("/api/medical-records/**")
                        .uri(medicalRecordServiceUrl))
                .route("audit-service", r -> r
                        .path("/api/audit/**")
                        .uri(auditServiceUrl))
                .build();
    }
}
