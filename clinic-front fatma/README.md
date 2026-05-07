# 🏥 ClinicOS — Clinic Management System

A complete **React + TypeScript + Tailwind CSS** frontend fully integrated with a **Spring Boot microservices backend**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Spring Boot backend running on `http://localhost:8080`

### Install & Run

```bash
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server **automatically proxies** all API requests to `http://localhost:8080` — no CORS issues.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Backend API Endpoints Used

| Method | Endpoint             | Used By              |
|--------|----------------------|----------------------|
| POST   | /auth/login          | All roles (login)    |
| POST   | /auth/register       | Patient (signup)     |
| GET    | /patients            | Admin, Doctor, Emp   |
| POST   | /patients            | Admin, Employee      |
| GET    | /doctors             | Booking modal        |
| GET    | /appointments        | All roles            |
| POST   | /appointments        | Employee, Patient    |
| PUT    | /appointments/:id/confirm | Admin, Employee |
| PUT    | /appointments/:id/cancel  | Admin, Employee |
| GET    | /medical-record      | Admin, Doctor        |
| POST   | /medical-record      | Doctor               |
| PUT    | /medical-record/:id  | Doctor               |
| GET    | /users               | Admin                |
| POST   | /users               | Admin                |
| DELETE | /users/:id           | Admin                |

---

## 📁 Project Structure

```
src/
├── api/                    ← Centralized API layer
│   ├── axios.ts            ← Axios instance + JWT interceptors
│   ├── authService.ts      ← login, register
│   ├── patientService.ts   ← CRUD patients
│   ├── doctorService.ts    ← GET doctors
│   ├── appointmentService.ts ← CRUD + confirm/cancel
│   ├── medicalRecordService.ts ← CRUD records
│   └── userService.ts      ← Admin user management
│
├── hooks/                  ← React data hooks (loading + error)
│   ├── usePatients.ts
│   ├── useDoctors.ts
│   ├── useAppointments.ts
│   ├── useMedicalRecords.ts
│   └── useUsers.ts
│
├── components/
│   ├── ui/                 ← Badge, Avatar, Modal, StatCard,
│   │                          LoadingSpinner, ErrorAlert, PageHeader
│   ├── layout/             ← Sidebar, Topbar, AppLayout
│   └── modals/             ← AddPatient, BookAppointment, MedicalRecord
│
├── pages/
│   ├── auth/               → LoginPage (real JWT login)
│   ├── admin/              → Dashboard, Patients, Appointments, Records, Users
│   ├── doctor/             → DoctorDashboard
│   ├── employee/           → EmployeeDashboard, PendingApprovals
│   └── patient/            → PatientDashboard, MyAppointments, MyRecords
│
├── router/                 ← AppRouter + ProtectedRoute (role-based)
├── store/                  ← Zustand (auth state, JWT, language)
├── types/                  ← TypeScript interfaces
└── utils/                  ← i18n (AR/EN) + helpers
```

---

## 🔐 Authentication Flow

1. User submits email + password → `POST /auth/login`
2. Backend returns `{ token, userId, name, email, role }`
3. Token stored in `localStorage` → attached to every request via Axios interceptor
4. 401 responses → auto redirect to `/login`
5. On logout → token cleared from storage + Zustand state reset

---

## 🌐 Language Support

Toggle between **Arabic (RTL)** and **English (LTR)** with the globe button in the top bar.  
Language preference is persisted in `localStorage`.

---

## ⚙️ Backend Customization

If your backend uses different endpoint paths or status values, update:
- `src/api/` — endpoint URLs
- `src/utils/helpers.ts` — status string mapping (e.g. `Pending` vs `PENDING`)
- `vite.config.ts` — proxy paths

---

## 🛠 Tech Stack

| Technology    | Version |
|---------------|---------|
| React         | 18.x    |
| TypeScript    | 5.x     |
| Vite          | 5.x     |
| Tailwind CSS  | 3.x     |
| React Router  | 6.x     |
| Zustand       | 4.x     |
| Axios         | 1.x     |
| Lucide React  | 0.44x   |
