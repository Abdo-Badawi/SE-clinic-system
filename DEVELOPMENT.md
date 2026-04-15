# Development Guide

## Quick Start

### 1. Build All Services
```bash
mvn clean install
```

### 2. Development Startup Order

**Terminal 1: Config Server**
```bash
cd config-server
mvn spring-boot:run
```

**Terminal 2: Service Registry (Eureka)**
```bash
cd service-registry
mvn spring-boot:run
```

**Terminal 3: API Gateway**
```bash
cd api-gateway
mvn spring-boot:run
```

**Terminal 4+: Business Services (in any order)**
```bash
cd auth-service && mvn spring-boot:run
cd patient-service && mvn spring-boot:run
cd doctor-service && mvn spring-boot:run
cd appointment-service && mvn spring-boot:run
cd medical-record-service && mvn spring-boot:run
cd audit-service && mvn spring-boot:run
```

## Common Development Tasks

### Testing a Service
```bash
# Test specific service
mvn test -pl auth-service

# Test all services
mvn test
```

### Adding Dependencies to Common Library
Edit `common-library/pom.xml` and add to dependencies section. All services inherit from this.

### Creating a REST Controller
Example in `auth-service/src/main/java/com/clinic/auth/controller/`:
```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service OK");
    }
}
```

### Using Feign Client for Service-to-Service Communication
Example in patient-service calling doctor-service:
```java
@FeignClient("doctor-service")
public interface DoctorServiceClient {
    @GetMapping("/doctors/{id}")
    DoctorDTO getDoctor(@PathVariable Long id);
}
```

### Accessing Configuration from Config Server
```java
@Value("${your.property.name}")
private String yourProperty;
```

## Port Reference

| Service | Port | Health Check |
|---------|------|--------------|
| API Gateway | 8080 | http://localhost:8080/actuator/health |
| Auth Service | 8081 | http://localhost:8081/actuator/health |
| Patient Service | 8082 | http://localhost:8082/actuator/health |
| Doctor Service | 8083 | http://localhost:8083/actuator/health |
| Appointment Service | 8084 | http://localhost:8084/actuator/health |
| Medical Record Service | 8085 | http://localhost:8085/actuator/health |
| Audit Service | 8086 | http://localhost:8086/actuator/health |
| Config Server | 8888 | http://localhost:8888/health |
| Service Registry (Eureka) | 8761 | http://localhost:8761/eureka |

## Debugging

### Enable Debug Logging
Add to `application.yml`:
```yaml
logging:
  level:
    com.clinic: DEBUG
    org.springframework.cloud: DEBUG
```

### View Registered Services
Visit: http://localhost:8761/eureka/apps

### Access H2 Console (for database inspection)
- **Auth Service**: http://localhost:8081/h2-console
- **Patient Service**: http://localhost:8082/h2-console
- **Doctor Service**: http://localhost:8083/h2-console
- **Appointment Service**: http://localhost:8084/h2-console
- **Medical Record Service**: http://localhost:8085/h2-console
- **Audit Service**: http://localhost:8086/h2-console

JDBC URL: `jdbc:h2:mem:<service>db` (e.g., `jdbc:h2:mem:authdb`)

## Docker Development

### Build and Run with Docker Compose
```bash
# Build all services first
mvn clean package

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart auth-service
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/service-name

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/service-name

# Create pull request on GitHub
```

## Code Organization

### Service Structure
```
service-name/
├── src/main/java/com/clinic/service/
│   ├── ServiceApplication.java
│   ├── controller/          # REST endpoints
│   ├── service/             # Business logic
│   ├── repository/          # Data access
│   ├── model/              # Entity classes
│   ├── dto/                # Data transfer objects
│   └── client/             # Feign clients (inter-service calls)
└── src/main/resources/
    ├── bootstrap.yml       # Config server settings
    └── application.yml     # Local configuration
```

## Best Practices

### 1. Error Handling
- Use global exception handlers with `@ControllerAdvice`
- Return appropriate HTTP status codes
- Log errors with sufficient context

### 2. Logging
```java
private static final Logger logger = LoggerFactory.getLogger(YourClass.class);
logger.info("Message: {}", variable);
logger.error("Error occurred", exception);
```

### 3. Configuration
- Use externalized configuration in `clinic-config-repo/`
- Profile-specific configs: `service-name-profile.yml`
- Sensitive data: Use Config Server security features

### 4. API Versioning
```java
@RestController
@RequestMapping("/api/v1/patients")
public class PatientController { ... }
```

### 5. Service Naming
- Controller: `EntityController`
- Service: `EntityService`
- Repository: `EntityRepository`
- DTO: `EntityDTO`

## Monitoring & Troubleshooting

### Service Not Starting
1. Check port availability
2. Review logs for missing dependencies
3. Verify Config Server is running
4. Check bootstrap.yml configuration

### Service Not Registering with Eureka
1. Ensure Service Registry is running
2. Check eureka.client.service-url in application.yml
3. Review logs for registration errors

### Feign Client Failures
1. Verify target service is running and registered
2. Check endpoint paths
3. Enable debug logging for `feign.SynchronousMethodHandler`

## IDE Setup

### IntelliJ IDEA
1. Import as Maven project
2. Mark modules as source roots
3. Enable annotation processing for `@Component`, etc.
4. Set Java SDK to version 25

### VS Code
1. Install Extension Pack for Java
2. Install Spring Boot Extension Pack
3. Configure launch configurations in `.vscode/launch.json`

## Testing Strategy

### Unit Tests
Located in `src/test/java`. Test business logic in isolation.

### Integration Tests
Create separate test classes with `@SpringBootTest` for integration testing.

```java
@SpringBootTest
class AuthServiceApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

### Testing Service Calls
Use `@MockBean` for external service dependencies.

```java
@SpringBootTest
class PatientServiceTests {
    @MockBean
    private DoctorServiceClient doctorServiceClient;
}
```

## Additional Resources

- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Netflix Eureka Wiki](https://github.com/Netflix/eureka/wiki)
- [OpenFeign Documentation](https://github.com/OpenFeign/feign)
