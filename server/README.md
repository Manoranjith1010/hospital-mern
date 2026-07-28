# Hospital Management System - Server

This is the server application for the Hospital Management System built with Node.js and Express.

## Features

- User authentication with JWT
- Role-based access control (RBAC)
- Patient management
- Doctor management
- Appointment scheduling
- Medical records management
- Email notifications
- Comprehensive logging
- Error handling

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the server directory with the required variables (see `.env` template).

## Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/:id/appointments` - Get patient appointments
- `GET /api/patients/:id/medical-records` - Get patient medical records

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/specialization/:specialization` - Get doctors by specialization
- `POST /api/doctors` - Create doctor (admin only)
- `PUT /api/doctors/:id` - Update doctor
- `GET /api/doctors/:id/availability` - Get doctor availability
- `PUT /api/doctors/:id/availability` - Update availability

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `POST /api/appointments/:id/cancel` - Cancel appointment
- `POST /api/appointments/:id/reschedule` - Reschedule appointment
- `POST /api/appointments/:id/complete` - Complete appointment

### Medical Records
- `GET /api/medical-records` - Get all records
- `POST /api/medical-records` - Create record
- `GET /api/medical-records/:id` - Get record by ID
- `PUT /api/medical-records/:id` - Update record
- `GET /api/medical-records/patient/:patientId` - Get patient records
- `DELETE /api/medical-records/:id` - Delete record

## Structure

```
server/
├── config/          # Configuration files
├── controllers/     # Route handlers
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── middleware/      # Custom middleware
├── validators/      # Input validation
├── utils/           # Utility functions
├── jobs/            # Cron jobs
├── logs/            # Application logs
├── tests/           # Test files
├── app.js           # Express app setup
├── server.js        # Server startup
└── package.json
```

## Testing

```bash
npm test
```

## License

MIT
