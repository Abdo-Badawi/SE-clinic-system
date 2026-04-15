# 🏥 ClinicOS — Clinic Management System

A complete, production-ready **React + TypeScript + Tailwind CSS** frontend for a single-doctor clinic management system with **4 user roles**, full **RTL Arabic support**, and a premium UI.

---

## ✨ Features

- **4 Role-based dashboards**: Admin, Doctor, Employee (Secretary), Patient
- **Full Arabic / English** language toggle with RTL support
- **Protected Routes** per role
- **Live state management** via Zustand
- **Functional interactions**: confirm/cancel appointments, add patients, add/edit medical records
- **Modern UI**: Tailwind CSS with a custom medical color palette
- **Modals**: Add Patient, Book Appointment, New/Edit Medical Record

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Install & Run

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
\`\`\`

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

---

## 🔑 Demo Credentials

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@clinic.com      | admin123    |
| Doctor   | doctor@clinic.com     | doctor123   |
| Employee | employee@clinic.com   | emp123      |
| Patient  | patient@clinic.com    | pat123      |

> Or use the **Quick Demo Access** buttons on the login page.

---

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── ui/           # Badge, Avatar, Modal, StatCard, PageHeader, EmptyState
│   ├── layout/       # Sidebar, Topbar, AppLayout
│   └── modals/       # AddPatientModal, BookAppointmentModal, MedicalRecordModal
├── data/
│   └── mockData.ts   # Fake data (patients, appointments, records, users)
├── pages/
│   ├── auth/         # LoginPage
│   ├── admin/        # AdminDashboard, PatientsPage, AppointmentsPage, MedicalHistoryPage, UsersPage
│   ├── doctor/       # DoctorDashboard
│   ├── employee/     # EmployeeDashboard, PendingApprovalsPage
│   └── patient/      # PatientDashboard, MyAppointmentsPage, MyRecordsPage
├── router/
│   ├── AppRouter.tsx       # All routes
│   └── ProtectedRoute.tsx  # Role-based guard
├── store/
│   └── useAppStore.ts      # Zustand global state
├── types/
│   └── index.ts            # TypeScript types
└── utils/
    ├── i18n.ts             # Arabic / English translations
    └── helpers.ts          # Utility functions
\`\`\`

---

## 🔗 Connecting to a Backend (Spring Boot)

Replace the mock data in `src/data/mockData.ts` with real API calls.

1. Create an `src/api/` folder with Axios:
\`\`\`bash
npm install axios
\`\`\`

2. Create `src/api/axios.ts`:
\`\`\`ts
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default api;
\`\`\`

3. Replace Zustand mock actions with real API calls in `src/store/useAppStore.ts`.

---

## 🛠 Tech Stack

| Technology       | Version  |
|------------------|----------|
| React            | 18.x     |
| TypeScript       | 5.x      |
| Vite             | 5.x      |
| Tailwind CSS     | 3.x      |
| React Router     | 6.x      |
| Zustand          | 4.x      |
| Lucide React     | 0.44x    |

---

## 📄 License

MIT — free to use in commercial projects.
