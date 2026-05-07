# ClinicOS Frontend

React frontend for the Clinic Management System microservices API.

## Setup

```bash
npm install
npm start
```

Opens at **http://localhost:3000**. API is proxied to `http://localhost:8080` by default (configurable on the login screen).

## API Coverage

Every endpoint from the Postman collection is implemented:

| Module | Endpoints |
|--------|-----------|
| Auth | POST /login · POST /register · POST /admin/users · GET /validate · GET /internal/users/:id |
| Patients | GET /:id · POST / · PUT /:id · DELETE /:id |
| Doctors | GET / · POST / · PUT /:id · DELETE /:id |
| Appointments | POST / · POST /available-slots · GET /patient/:id · GET /doctor/:id · PUT /:id/status · PUT /:id/cancel · DELETE /:id |
| Medical Records | GET /patient/:id · POST / · PUT /:id |
| Audit Logs | GET /logs · GET /logs/user/:id · GET /logs/action/:action |

## Project Structure

```
src/
├── services/
│   └── api.js            ← All API calls, one function per endpoint
├── hooks/
│   └── useAuth.js        ← Auth context (token, user, login, logout)
├── components/
│   ├── Sidebar.jsx       ← Role-aware navigation
│   └── UI.jsx            ← ResponseBox, SendButton, Tabs, Alert, Badge…
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── AuthPage.jsx
│   ├── PatientsPage.jsx
│   ├── DoctorsPage.jsx
│   ├── AppointmentsPage.jsx
│   ├── RecordsPage.jsx
│   └── AuditPage.jsx
├── styles/
│   └── global.css
├── App.jsx
└── index.js
```

## Role-based Navigation

Use the **View as** dropdown in the sidebar to switch between role views:

- **Admin** — full access: auth, patients, doctors, appointments, records, audit
- **Doctor** — schedule, medical records, patients
- **Receptionist** — patients, appointments, doctors
- **Patient** — own profile, own appointments, own records

## Notes

- JWT token is saved to `localStorage` on login and auto-attached to all requests
- The `available-slots` endpoint sends **no auth header** (public endpoint)
- Base URL is configurable per session on the login screen
- Response boxes show HTTP status + raw JSON for every call
