package com.clinic.audit.controller;

import com.clinic.audit.dto.AuditEvent;
import com.clinic.audit.model.entity.AuditLog;
import com.clinic.audit.service.AuditService;
import com.clinic.common.annotation.Loggable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping("/logs")
    @Loggable
    public ResponseEntity<AuditLog> logEvent(@Valid @RequestBody AuditEvent event) {
        return new ResponseEntity<>(auditService.logEvent(event), HttpStatus.CREATED);
    }

    @GetMapping("/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditService.getAllLogs());
    }

    @GetMapping("/logs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditLog> getLogById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(auditService.getLogById(id));
    }

    @GetMapping("/logs/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getLogsByUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(auditService.getLogsByUser(userId));
    }

    @GetMapping("/logs/action/{action}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getLogsByAction(@PathVariable("action") String action) {
        return ResponseEntity.ok(auditService.getLogsByAction(action));
    }
}