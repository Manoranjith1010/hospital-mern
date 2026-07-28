# Hospital Management System - Quick Reference Guide

## 🚀 QUICK START (Copy & Paste)

### Start Everything with Docker Compose
```bash
cd /workspaces/hospital-mern
docker-compose up -d
```

Then access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: mongodb://root:rootpassword@localhost:27017

---

## 📁 KEY FILES & DIRECTORIES

### Backend Core Files
| File | Purpose |
|------|---------|
| `server/server.js` | Express server entry point |
| `server/app.js` | Express app setup & middleware |
| `server/config/db.js` | MongoDB connection |
| `server/routes/index.js` | Main router (aggregates all routes) |

### Backend Models (Database Schemas)
| Model | File | Purpose |
|-------|------|---------|
| User | `models/User.js` | Base user schema (auth) |
| Patient | `models/Patient.js` | Patient info & appointments |
| Doctor | `models/Doctor.js` | Doctor profiles & availability |
| Appointment | `models/Appointment.js` | Appointment scheduling |
| MedicalRecord | `models/MedicalRecord.js` | Medical documentation |
| Notification | `models/Notification.js` | Notification system |
| Staff | `models/Staff.js` | Hospital staff |

### Backend Services (Business Logic)
| Service | File | Methods |
|---------|------|---------|
| Auth | `services/authService.js` | login(), register(), updateProfile() |
| Patient | `services/patientService.js` | CRUD operations, medical history |
| Doctor | `services/doctorService.js` | Doctor management, availability |
| Appointment | `services/appointmentService.js` | Book, cancel, reschedule |
| MedicalRecord | `services/medicalRecordService.js` | Record management |

### Backend Controllers (Request Handlers)
| Controller | File | Routes |
|------------|------|--------|
| Auth | `controllers/authController.js` | /auth/* |
| Patient | `controllers/patientController.js` | /patients/* |
| Doctor | `controllers/doctorController.js` | /doctors/* |
| Appointment | `controllers/appointmentController.js` | /appointments/* |
| Medical Record | `controllers/medicalRecordController.js` | /medical-records/* |

### Frontend Key Files
| File | Purpose |
|------|---------|
| `client/src/App.jsx` | Root component with providers |
| `client/src/main.jsx` | React entry point |
| `client/vite.config.js` | Build configuration |
| `client/src/api/client.js` | Axios instance with interceptors |

### Frontend Redux (State Management)
| Slice | File | State |
|-------|------|-------|
| Auth | `features/auth/authSlice.js` | user, token, auth status |
| Patients | `features/patients/patientSlice.js` | patient list, current patient |
| Appointments | `features/appointments/appointmentSlice.js` | appointments list |
| Notifications | `features/notifications/notificationSlice.js` | notifications |

### Frontend Custom Hooks
| Hook | File | Use Case |
|------|------|----------|
| useAuth | `hooks/useAuth.js` | Authentication operations |
| useNotification | `hooks/useNotification.js` | Notification display |
| useFetch | `hooks/useFetch.js` | API data fetching |

### Frontend Pages
| Page | File | Route |
|------|------|-------|
| Login | `pages/LoginPage.jsx` | /login |
| Dashboard | `pages/DashboardPage.jsx` | / |
| Doctors | `pages/DoctorsPage.jsx` | /doctors |
| Appointments | `pages/AppointmentsPage.jsx` | /appointments |

---

## 🔧 COMMON TASKS

### View Backend Logs
```bash
docker-compose logs -f backend
```

### View Frontend Logs
```bash
docker-compose logs -f frontend
```

### Access MongoDB Shell
```bash
docker-compose exec mongodb mongo -u root -p rootpassword
```

### Restart a Service
```bash
docker-compose restart backend      # Restart backend
docker-compose restart frontend     # Restart frontend
docker-compose restart mongodb      # Restart database
```

### Rebuild Containers After Code Changes
```bash
docker-compose down
docker-compose up -d
```

### View Running Containers
```bash
docker-compose ps
```

### Stop All Services
```bash
docker-compose down
```

### Clean Everything (WARNING: Deletes data!)
```bash
docker-compose down -v
```

---

## 🔑 DEFAULT CREDENTIALS

### MongoDB
- **URL**: `mongodb://localhost:27017`
- **User**: `root`
- **Password**: `rootpassword`
- **Database**: `hospital_db`

### Test Account (After registration)
- Email: Use any valid email
- Password: Create during registration

---

## 📊 API TEST EXAMPLES

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### List All Doctors
```bash
curl http://localhost:5000/api/doctors
```

### Get Patient Profile
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctor":"doctor_id",
    "appointmentDate":"2024-05-20",
    "appointmentTime":"10:00",
    "reason":"Regular checkup"
  }'
```

---

## 🎯 IMPORTANT ENVIRONMENT VARIABLES

### Backend (.env in server/ directory)
```env
# Required
PORT=5000
MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/hospital_db
JWT_SECRET=your_secret_key_here

# Optional but recommended
NODE_ENV=development
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Frontend (.env in client/ directory)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📈 PROJECT STRUCTURE OVERVIEW

```
hospital-mern/
├── Backend (Node.js + Express + MongoDB)
│   ├── Authentication & Authorization
│   ├── Patient Management
│   ├── Doctor Management
│   ├── Appointment System
│   ├── Medical Records
│   └── Notifications
│
├── Frontend (React + Redux + Tailwind)
│   ├── Login/Authentication
│   ├── Dashboard
│   ├── Doctor Discovery
│   ├── Appointment Management
│   └── Medical Records View
│
└── Infrastructure (Docker)
    ├── Backend Container
    ├── Frontend Container
    └── MongoDB Container
```

---

## 🚨 TROUBLESHOOTING QUICK FIXES

### Problem: "MongoDB connection refused"
```bash
# Solution: Restart MongoDB
docker-compose restart mongodb
```

### Problem: "Port 5000 already in use"
```bash
# Solution: Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Problem: "Frontend can't connect to backend"
```bash
# Solution: Check docker network
docker-compose logs backend | grep "listening"
# Check frontend .env has correct VITE_API_BASE_URL
```

### Problem: "Changes not showing up"
```bash
# Solution: Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Problem: "Database lost after restart"
```bash
# Solution: Use named volumes (already configured in docker-compose.yml)
# Data persists in mongodb-data volume
```

---

## 🎓 KEY CONCEPTS

### JWT Authentication Flow
1. User logs in with email/password
2. Backend verifies credentials and sends JWT token
3. Frontend stores token in Redux state
4. Token sent in `Authorization: Bearer TOKEN` header
5. Backend validates token on protected routes
6. Token expires after 7 days (configurable)

### Appointment Workflow
1. Patient browses doctors
2. Patient selects doctor and appointment slot
3. System checks for conflicts
4. Appointment created and stored in MongoDB
5. Email reminder sent 24 hours before
6. Patient can cancel or reschedule
7. Doctor completes and records diagnosis

### State Management (Redux)
- **Store**: Central state container
- **Slices**: Feature-specific state (auth, patients, appointments)
- **Thunks**: Async operations (API calls)
- **Selectors**: Extract state values
- **Dispatches**: Trigger actions

---

## 📚 ADDITIONAL RESOURCES

- Backend README: `server/README.md`
- Frontend README: `client/README.md`
- Full Summary: `BUILD_SUMMARY.md`
- Docker Compose Config: `docker-compose.yml`

---

## ✅ PRODUCTION CHECKLIST

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Configure SMTP for email notifications
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Update CORS_ORIGIN to your domain
- [ ] Set up database backups
- [ ] Configure logging/monitoring
- [ ] Load test the application
- [ ] Run security audit
- [ ] Test all critical flows
- [ ] Set up monitoring alerts
- [ ] Plan disaster recovery

---

## 🆘 GETTING HELP

1. **Check logs**: `docker-compose logs -f`
2. **Verify configuration**: Check `.env` files
3. **Test connectivity**: `curl http://localhost:5000/health`
4. **Read documentation**: Check README files
5. **Check Docker**: `docker-compose ps`

---

## 📞 KEY CONTACTS & LINKS

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Redux Docs**: https://redux.js.org/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 📝 NOTES

- All files are production-ready
- Code includes comprehensive error handling
- Input validation on server and client
- Scalable architecture for growth
- Easy to extend with new features
- Docker setup for consistent environments

---

**Quick Reference Version**: 1.0  
**Last Updated**: May 2024  
**Status**: ✅ **COMPLETE**
