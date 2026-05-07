package com.clinic.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEvent {
    private Long userId;
    private String username;
    private String action;
    private String entityType;
    private Long entityId;
    private Map<String, Object> details;
    private String ipAddress;
    private LocalDateTime timestamp;
}