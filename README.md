# TransitOps

**Smart Transport Operations Platform** — a centralized system for managing the complete lifecycle of transport operations: vehicles, drivers, dispatching, maintenance, and reporting.

Built for Odoo Hackathon 2026.

Many logistics companies still run their fleets on spreadsheets and manual logbooks — leading to scheduling conflicts, underutilized vehicles, missed maintenance, expired driver licenses, and poor operational visibility. TransitOps replaces that with a single platform, role-based access, and structured workflows for every stage of a trip: from vehicle and driver onboarding to dispatch, completion, and reporting.

## Tech Stack

**Backend**
- FastAPI (Python)
- SQLAlchemy 2.0 (ORM) + Alembic (migrations)
- PostgreSQL
- JWT authentication (`python-jose`) with Argon2 password hashing (`pwdlib` / `argon2-cffi`)

**Frontend**
- React 19 + Vite
- Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- React Router v7
- Bootstrap 5
- Axios
- SweetAlert2, React Select, React Modal

## Features

- **Authentication & RBAC** — JWT-based login with four roles: `ADMIN`, `FLEET_MANAGER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`. Each endpoint enforces role-based permissions.
- **Vehicle Management** — register vehicles (truck, van, car, motorcycle), track odometer, acquisition cost, load capacity, and status (`AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`).
- **Driver Management** — driver profiles with license category/expiry tracking, contact info, safety score, and status (`AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `SUSPENDED`).
- **Trip Dispatching** — create, dispatch, complete, or cancel trips, with origin/destination, cargo weight, planned vs. actual distance, and timestamps.
- **Maintenance Tracking** — schedule and log maintenance (preventive, corrective, inspection, oil change, tire change) with cost and completion tracking.
- **Dashboard & Analytics** — aggregated operational stats via a dedicated dashboard endpoint.

## Project Structure

```
odoo-hackathon-2026/
├── backend/
│   ├── core/          # settings, security, auth dependencies
│   ├── db/            # database session, base model
│   ├── models/        # SQLAlchemy models (User, Driver, Vehicle, Trip, Maintenance)
│   ├── schemas/        # Pydantic request/response schemas
│   ├── routers/        # API route definitions
│   ├── services/       # business logic
│   ├── migrations/     # Alembic migrations
│   └── main.py          # FastAPI app entrypoint
└── frontend/
    ├── src/
    │   ├── pages/        # Login, Signup, Fleet, Drivers, Trips, Maintenance, Fuel, Analytics, Settings
    │   ├── modals/       # Add/Edit modals for drivers, vehicles, trips
    │   ├── components/   # Dashboard layout, tables, toolbar, toast
    │   ├── context/       # Auth context
    │   ├── redux/         # Store & user slice
    │   └── routes/        # App routing & protected routes
    └── package.json
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db_name>
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run database migrations:

```bash
alembic upgrade head
```

Start the API server:

```bash
uvicorn main:app --reload --port 8001
```

The API will be available at `http://localhost:8001`, with interactive docs at `http://localhost:8001/docs`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

## API Overview

| Resource | Base Path | Notes |
|---|---|---|
| Auth | `/api/auth` | register (admin-only), login, current user (`/me`) |
| Drivers | `/api/drivers` | CRUD, role-restricted create/update/delete |
| Trips | `/api/trips` | create, list, dispatch, complete, cancel |
| Maintenance | `/api/maintenance` | create, list, get, complete |
| Dashboard | `/api/dashboard` | aggregated stats |
| Reports | `/api/reports` | reporting endpoints |

Health check: `GET /health`

## Role-Based Access

| Role | Typical Scope |
|---|---|
| Admin | Full access to all modules |
| Fleet Manager | Vehicles, Drivers, Trips, Maintenance reports |
| Safety Officer | Drivers, Maintenance, Compliance |
| Financial Analyst | Vehicle/fuel reports, Analytics |

