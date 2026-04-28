$services = @("config-server","service-registry","auth-service","patient-service","doctor-service","appointment-service","medical-record-service","audit-service","api-gateway")
foreach ($s in $services) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\abdob\Desktop\clinic\$s'; mvn spring-boot:run"
    Start-Sleep -Seconds 10
}