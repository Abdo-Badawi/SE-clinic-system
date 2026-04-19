package com.clinic.audit.service.impl;

import com.clinic.audit.dto.AuditEvent;
import com.clinic.audit.model.entity.AuditLog;
import com.clinic.audit.repository.AuditLogRepository;
import com.clinic.audit.service.AuditService;
import com.clinic.common.annotation.Loggable;
import com.clinic.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    @Loggable
    public AuditLog logEvent(AuditEvent event) {
        Map<String, Object> details = event.getDetails() != null ? event.getDetails() : new HashMap<>();
        if (event.getUsername() != null) {
            details.put("username", event.getUsername());
        }

        AuditLog auditLog = AuditLog.builder()
                .userId(event.getUserId())
                .action(event.getAction())
                .tableName(event.getEntityType())
                .recordId(event.getEntityId())
                .details(details)
                .ipAddress(event.getIpAddress())
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("Audit log created: ID {}, Action {}, User {}, Entity {}:{}",
                saved.getId(), saved.getAction(), saved.getUserId(),
                saved.getTableName(), saved.getRecordId());

        return saved;
    }

    @Override
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    public List<AuditLog> getLogsByUser(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    @Override
    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }

    @Override
    public AuditLog getLogById(Long id) {
        return auditLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AuditLog", "id", id));
    }
}