# Patient Registration Application

**E‑MED Healthcare Technical Exam — Documentation**

Modern, clean CRUD system for patient records using Angular + .NET + SQL Server by Rodney Austria

---

## Highlights
- Full CRUD coverage mapped to exam requirements
- Stored‑procedure–based data access
- Auto‑generated `PatientNo` with 8‑digit format
- Modern Angular standalone UI with Tailwind styling

---

## Requirements Coverage

| Requirement | Status | Implementation |
|---|---|---|
| Create new patient | ✅ | API POST + UI form |
| View patient | ✅ | API GET by id + UI list |
| Update patient | ✅ | API PUT + UI edit mode |
| Remove patient | ✅ | API DELETE + UI confirm modal |
| View all patients | ✅ | API GET all + searchable list |

Expected schema and stored procedures are defined in [db_script.sql](db_script.sql).

---

##  Architecture Overview

**PatientApi** (Backend)
- ASP.NET Core Web API with EF Core
- Stored procedures for all CRUD operations
- CORS enabled for local Angular dev

**PatientClient** (Frontend)
- Angular 21 standalone components
- Tailwind CSS UI system
- API consumption via `HttpClient`

---

## Project Map

**Backend**
- Controllers: [PatientApi/Controllers/PatientsController.cs](PatientApi/Controllers/PatientsController.cs)
- Data Context: [PatientApi/Data/AppDbContext.cs](PatientApi/Data/AppDbContext.cs)
- Domain Model: [PatientApi/Models/Patient.cs](PatientApi/Models/Patient.cs)
- Services: [PatientApi/Services/IPatientService.cs](PatientApi/Services/IPatientService.cs), [PatientApi/Services/PatientService.cs](PatientApi/Services/PatientService.cs)
- Startup: [PatientApi/Program.cs](PatientApi/Program.cs)

**Frontend**
- App Shell: [PatientClient/src/app/app.ts](PatientClient/src/app/app.ts), [PatientClient/src/app/app.html](PatientClient/src/app/app.html)
- Routing: [PatientClient/src/app/app.routes.ts](PatientClient/src/app/app.routes.ts)
- Patients Page: [PatientClient/src/app/pages/patients/patients.component.ts](PatientClient/src/app/pages/patients/patients.component.ts)
- Patient Form: [PatientClient/src/app/components/patient-form/patient-form.component.ts](PatientClient/src/app/components/patient-form/patient-form.component.ts)
- Services: [PatientClient/src/app/services/patient.service.ts](PatientClient/src/app/services/patient.service.ts), [PatientClient/src/app/services/notification.service.ts](PatientClient/src/app/services/notification.service.ts)
- Styling: [PatientClient/src/styles.css](PatientClient/src/styles.css)

---

## Data Model

Entity: `Patient`
- `Id` (int, identity)
- `FirstName` (varchar(50), nullable)
- `MiddleName` (varchar(50), nullable)
- `LastName` (varchar(50), required)
- `SuffixName` (varchar(10), nullable)
- `BirthDate` (datetime, nullable)
- `Gender` (varchar(10), nullable)
- `InitialDiagnosis` (varchar(500), required)
- `PatientNo` (varchar(8), auto‑generated)

See annotations in [PatientApi/Models/Patient.cs](PatientApi/Models/Patient.cs).

---

## Stored Procedures (SQL Server)
Defined in [db_script.sql](db_script.sql).

- `sp_GetAllPatients`
- `sp_GetPatientById`
- `sp_CreatePatient`
- `sp_UpdatePatient`
- `sp_DeletePatient`

`PatientNo` is generated server‑side during insert using the new identity value, padded to 8 digits.

---

##  API Endpoints

Base Route: `/api/patients`

| Method | Route | Description |
|---|---|---|
| GET | /api/patients | Retrieve all patients |
| GET | /api/patients/{id} | Retrieve a patient by ID |
| POST | /api/patients | Create a new patient |
| PUT | /api/patients/{id} | Update a patient |
| DELETE | /api/patients/{id} | Delete a patient |

Controller reference: [PatientApi/Controllers/PatientsController.cs](PatientApi/Controllers/PatientsController.cs)

---

## Frontend UI Flow
1. **List View**: searchable table of patients
2. **Create Mode**: form submission via POST
3. **Edit Mode**: load + update via PUT
4. **Delete Flow**: confirmation modal + DELETE

Form validation enforces required fields and length constraints, plus a no‑future‑date rule.

---

## Configuration

- Connection string: [PatientApi/appsettings.json](PatientApi/appsettings.json)
- Local ports: [PatientApi/Properties/launchSettings.json](PatientApi/Properties/launchSettings.json)
- Default API URL: http://localhost:5010

---

## Local Setup (Summary)

1. Execute [db_script.sql](db_script.sql) on SQL Server to create schema and stored procedures.
2. Run the API from the PatientApi project.
3. Run the Angular app from PatientClient and open http://localhost:4200.

---

## How to Run the Entire App

**Prerequisites**
- .NET SDK (net10.0)
- Node.js (20+) and npm
- SQL Server or LocalDB

**1) Database**
- Run [db_script.sql](db_script.sql) in SQL Server to create the database and stored procedures.
- If needed, update the connection string in [PatientApi/appsettings.json](PatientApi/appsettings.json).

**2) Start the API**
From the PatientApi folder:

```
dotnet restore
dotnet run
```

API will run at `http://localhost:5010` (see [PatientApi/Properties/launchSettings.json](PatientApi/Properties/launchSettings.json)).

**3) Start the Angular Client**
From the PatientClient folder:

```
npm install
npm start
```

Client will run at `http://localhost:4200`.

**4) Open the App**
- Navigate to `http://localhost:4200`
- The client will call the API at `http://localhost:5010/api/patients`

---

## Security & CORS
Local CORS allows the Angular dev server. See [PatientApi/Program.cs](PatientApi/Program.cs).

---

## Known Constraints
- No authentication (per exam scope)
- Minimal API error handling
- Patient number is generated server‑side

---

## Appendix
- Database script: [db_script.sql](db_script.sql)
- API entry: [PatientApi/Program.cs](PatientApi/Program.cs)
- Patient controller: [PatientApi/Controllers/PatientsController.cs](PatientApi/Controllers/PatientsController.cs)
- Patients page: [PatientClient/src/app/pages/patients/patients.component.ts](PatientClient/src/app/pages/patients/patients.component.ts)
- Patient form: [PatientClient/src/app/components/patient-form/patient-form.component.ts](PatientClient/src/app/components/patient-form/patient-form.component.ts)
