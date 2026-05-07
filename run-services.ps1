$services = @(
  "api-gateway",
  "appointment-service",
  "audit-service",
  "auth-service",
  "config-server",
  "doctor-service",
  "medical-record-service",
  "patient-service",
  "service-registry"
)

foreach ($service in $services) {

    $cmd = "cd `"$PWD\$service`"; mvn spring-boot:run"

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd
}