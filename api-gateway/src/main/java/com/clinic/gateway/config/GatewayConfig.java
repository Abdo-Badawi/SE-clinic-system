package com.clinic.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("http://localhost:8081"))
                .route("patient-service", r -> r
                        .path("/api/patients/**")
                        .uri("http://localhost:8082"))
                .route("doctor-service", r -> r
                        .path("/api/doctors/**")
                        .uri("http://localhost:8083"))
                .route("appointment-service", r -> r
                        .path("/api/appointments/**")
                        .uri("http://localhost:8084"))
                .route("medical-record-service", r -> r
                        .path("/api/medical-records/**")
                        .uri("http://localhost:8085"))
                .route("audit-service", r -> r
                        .path("/api/audit/**")
                        .uri("http://localhost:8086"))
                .build();
    }
}