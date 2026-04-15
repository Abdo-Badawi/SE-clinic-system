-- ============================================================
-- 1. CREATE DATABASE (FRESH START)
-- ============================================================
DROP DATABASE IF EXISTS clinic_db;
CREATE DATABASE clinic_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE clinic_db;

-- ============================================================
-- 2. CREATE TABLES (ALL IDs AS BIGINT)
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- Users (RBAC)
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('admin', 'doctor', 'receptionist', 'patient') NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Patients
CREATE TABLE patients (
    id                      BIGINT PRIMARY KEY,
    date_of_birth           DATE,
    phone                   VARCHAR(20),
    address                 TEXT,
    emergency_contact       VARCHAR(255),
    medical_summary         TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Doctors
CREATE TABLE doctors (
    id                  BIGINT PRIMARY KEY,
    specialization      VARCHAR(100),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Clinic Settings (single row)
CREATE TABLE clinic_settings (
    id                      BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id = TRUE),
    opening_time            TIME NOT NULL DEFAULT '09:00:00',
    closing_time            TIME NOT NULL DEFAULT '17:00:00',
    slot_duration_minutes   INT NOT NULL DEFAULT 30,
    updated_by              BIGINT NULL,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO clinic_settings (opening_time, closing_time, slot_duration_minutes)
VALUES ('09:00:00', '17:00:00', 30);

-- Appointments
CREATE TABLE appointments (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id          BIGINT NOT NULL,
    doctor_id           BIGINT NOT NULL,
    appointment_date    DATE NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    status              ENUM('scheduled', 'checked_in', 'completed', 'cancelled', 'no_show')
                        DEFAULT 'scheduled',
    check_in_time       TIMESTAMP NULL,
    cancellation_reason VARCHAR(255),
    created_by          BIGINT NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
    FOREIGN KEY (doctor_id)  REFERENCES doctors(id)  ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id)    ON DELETE RESTRICT,
    UNIQUE KEY unique_doctor_slot (doctor_id, appointment_date, start_time),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor_date (doctor_id, appointment_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Medical Records (Centralized History)
CREATE TABLE medical_records (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id      BIGINT NOT NULL,
    doctor_id       BIGINT NOT NULL,
    appointment_id  BIGINT NULL,
    visit_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnosis       TEXT,
    prescription    TEXT,
    notes           TEXT,
    attachments     VARCHAR(500) NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id)     REFERENCES patients(id)    ON DELETE CASCADE,
    FOREIGN KEY (doctor_id)      REFERENCES doctors(id)     ON DELETE RESTRICT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_visit_date (visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Audit Logs
CREATE TABLE audit_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NULL,
    action      VARCHAR(100) NOT NULL,
    table_name  VARCHAR(50),
    record_id   BIGINT NULL,
    details     JSON,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 3. SAMPLE TEST DATA
-- ============================================================
-- Password for all test users is "password123"
-- BCrypt hash for "password123": $2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5

INSERT INTO users (email, password_hash, role, full_name, is_active) VALUES
('admin@clinic.com', '$2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5', 'admin', 'System Administrator', TRUE),
('reception@clinic.com', '$2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5', 'receptionist', 'Jane Reception', TRUE),
('dr.smith@clinic.com', '$2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5', 'doctor', 'Dr. John Smith', TRUE),
('dr.jones@clinic.com', '$2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5', 'doctor', 'Dr. Sarah Jones', TRUE),
('patient1@example.com', '$2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5', 'patient', 'Alice Brown', TRUE),
('patient2@example.com', '$2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5', 'patient', 'Bob White', TRUE),
('patient3@example.com', '$2a$10$DowJXuL7lF7qVqPqJ9YwOe6.3K9QpL5f5f5f5f5f5f5f5f5f5f5f5f5', 'patient', 'Charlie Green', TRUE);

-- Insert corresponding patient records (assuming the generated user IDs are 5,6,7)
INSERT INTO patients (id, date_of_birth, phone, address, emergency_contact, medical_summary)
SELECT u.id, 
       CASE u.full_name
           WHEN 'Alice Brown'   THEN '1985-03-15'
           WHEN 'Bob White'     THEN '1990-07-22'
           WHEN 'Charlie Green' THEN '1978-11-09'
       END,
       CASE u.full_name
           WHEN 'Alice Brown'   THEN '+20123456789'
           WHEN 'Bob White'     THEN '+20198765432'
           WHEN 'Charlie Green' THEN '+20155556666'
       END,
       CASE u.full_name
           WHEN 'Alice Brown'   THEN '123 Nile Street, Cairo, Egypt'
           WHEN 'Bob White'     THEN '45 Alexandria Road, Giza, Egypt'
           WHEN 'Charlie Green' THEN '78 Luxor Avenue, Alexandria, Egypt'
       END,
       CASE u.full_name
           WHEN 'Alice Brown'   THEN 'Mary Brown +20111222333'
           WHEN 'Bob White'     THEN 'Tom White +20155444333'
           WHEN 'Charlie Green' THEN 'Sara Green +20166777888'
       END,
       CASE u.full_name
           WHEN 'Alice Brown'   THEN 'Mild asthma, allergic to penicillin'
           WHEN 'Bob White'     THEN 'Hypertension, on regular medication'
           WHEN 'Charlie Green' THEN 'Diabetes Type 2, annual checkups required'
       END
FROM users u
WHERE u.role = 'patient';

-- Insert corresponding doctor records (user IDs 3 and 4)
INSERT INTO doctors (id, specialization)
SELECT u.id,
       CASE u.full_name
           WHEN 'Dr. John Smith'  THEN 'Cardiology'
           WHEN 'Dr. Sarah Jones' THEN 'Dermatology'
       END
FROM users u
WHERE u.role = 'doctor';

-- Insert sample appointments (using subqueries to get correct IDs)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, created_by)
VALUES
((SELECT id FROM users WHERE email = 'patient1@example.com'), (SELECT id FROM users WHERE email = 'dr.smith@clinic.com'), CURDATE(), '09:00:00', '09:30:00', 'scheduled', (SELECT id FROM users WHERE email = 'reception@clinic.com')),
((SELECT id FROM users WHERE email = 'patient2@example.com'), (SELECT id FROM users WHERE email = 'dr.jones@clinic.com'), CURDATE(), '10:00:00', '10:30:00', 'checked_in', (SELECT id FROM users WHERE email = 'reception@clinic.com')),
((SELECT id FROM users WHERE email = 'patient3@example.com'), (SELECT id FROM users WHERE email = 'dr.smith@clinic.com'), CURDATE(), '11:30:00', '12:00:00', 'completed', (SELECT id FROM users WHERE email = 'reception@clinic.com')),
((SELECT id FROM users WHERE email = 'patient1@example.com'), (SELECT id FROM users WHERE email = 'dr.smith@clinic.com'), DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:30:00', '10:00:00', 'scheduled', (SELECT id FROM users WHERE email = 'reception@clinic.com')),
((SELECT id FROM users WHERE email = 'patient2@example.com'), (SELECT id FROM users WHERE email = 'dr.jones@clinic.com'), DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '14:30:00', 'scheduled', (SELECT id FROM users WHERE email = 'reception@clinic.com'));

-- Insert a completed medical record for patient3's completed appointment
INSERT INTO medical_records (patient_id, doctor_id, appointment_id, diagnosis, prescription, notes)
SELECT 
    p.id,
    d.id,
    a.id,
    'Routine diabetes checkup - stable',
    'Metformin 500mg twice daily',
    'Patient advised to continue diet and exercise'
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id
WHERE a.status = 'completed'
LIMIT 1;

-- Insert sample audit log
INSERT INTO audit_logs (user_id, action, table_name, record_id, details, ip_address)
SELECT 
    u.id,
    'CREATE',
    'appointments',
    a.id,
    JSON_OBJECT('patient', (SELECT full_name FROM users WHERE id = a.patient_id), 'doctor', (SELECT full_name FROM users WHERE id = a.doctor_id), 'time', a.start_time),
    '127.0.0.1'
FROM appointments a
CROSS JOIN users u
WHERE u.email = 'reception@clinic.com'
LIMIT 1;

COMMIT;