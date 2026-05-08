package com.clinic.common.aspect;

import com.clinic.common.annotation.Auditable;
import com.clinic.common.dto.AuditEvent;
import com.clinic.common.security.JwtUtil;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.time.LocalDateTime;

@Aspect
@Component
public class AuditAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditAspect.class);

    @Autowired(required = false)
    private RestTemplate restTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${audit.service.url:http://localhost:8086}")
    private String auditServiceUrl;

    @AfterReturning(pointcut = "@annotation(com.clinic.common.annotation.Auditable)", returning = "result")
    public void sendAudit(JoinPoint joinPoint, Object result) {
        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            Auditable auditable = method.getAnnotation(Auditable.class);

            // Extract user from JWT in the current request
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                    .currentRequestAttributes()).getRequest();
            String authHeader = request.getHeader("Authorization");
            Long userId = null;
            String username = "anonymous";

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    userId = jwtUtil.extractUserId(token);
                    username = jwtUtil.extractUsername(token);
                }
            }

            AuditEvent event = AuditEvent.builder()
                    .userId(userId)
                    .username(username)
                    .action(auditable.action())
                    .entityType(auditable.entityType())
                    .entityId(extractEntityId(joinPoint, result))
                    .details(null)
                    .ipAddress(request.getRemoteAddr())
                    .timestamp(LocalDateTime.now())
                    .build();

            // Send to audit-service
            if (restTemplate != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<AuditEvent> entity = new HttpEntity<>(event, headers);
                restTemplate.postForEntity(auditServiceUrl + "/api/audit/logs", entity, Void.class);
                log.debug("Audit event sent: {}", auditable.action());
            } else {
                log.warn("RestTemplate not available – audit event not sent");
            }
        } catch (Exception e) {
            log.error("Failed to send audit event: {}", e.getMessage());
        }
    }

    private Long extractEntityId(JoinPoint joinPoint, Object result) {
        // Try to get a Long ID from the method arguments
        for (Object arg : joinPoint.getArgs()) {
            if (arg instanceof Long) return (Long) arg;
        }
        // Try getId() on the returned object
        if (result != null) {
            try {
                return (Long) result.getClass().getMethod("getId").invoke(result);
            } catch (Exception ignored) {}
        }
        return null;
    }
}