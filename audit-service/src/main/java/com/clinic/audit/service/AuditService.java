package com.clinic.audit.service;

import com.clinic.audit.dto.AuditEvent;
import com.clinic.audit.model.entity.AuditLog;

import java.util.List;

public interface AuditService {
    AuditLog logEvent(AuditEvent event);
    List<AuditLog> getAllLogs();
    List<AuditLog> getLogsByUser(Long userId);
    List<AuditLog> getLogsByAction(String action);
    AuditLog getLogById(Long id);
}