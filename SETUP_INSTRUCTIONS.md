# School Management System - Setup Instructions

## Overview
I've fixed the connection issues between your frontend and backend. The main problems were:
1. ✅ API imports were commented out in the frontend
2. ✅ Student form was using mock data instead of real API calls
3. ✅ Teacher form had no submit handler
4. ✅ Login page was using a fake token instead of real authentication

All issues have been resolved!

---

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher)
- **PostgreSQL** database server running
- **npm** or **yarn** package manager

---

## Step 1: Database Setup

### Start PostgreSQL
Make sure your PostgreSQL server is running on your machine.

### Create Database
Open PostgreSQL command line (psql) or pgAdmin and create the database:

```sql
CREATE DATABASE school_mgmt;
```

### Configure Database Connection
The `.env` file has been created in the `backend` folder with these default settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_mgmt
DB_USER=postgres
DB_PASS=password
JWT_SECRET=school-mgmt-secret-key-2024
JWT_EXPIRES_IN=1d
PORT=4000
```

**⚠️ IMPORTANT:** Update `DB_USER` and `DB_PASS` in `backend/.env` to match your PostgreSQL credentials!

---

## Step 2: Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Start Backend Server
```bash
npm run dev
```

The backend will:
- Start on `http://localhost:4000`
- Automatically create all database tables
- Seed default roles (admin, teacher, user)
- Seed default permissions

You should see:
```
Tables created
Roles seeded
Permissions seeded
DB connected
Server on port 4000
```

**⚠️ Note:** The backend uses `sequelize.sync({ force: true })` which recreates tables on every restart. This is fine for development but will clear all data each time you restart the server.

---

## Step 3: Frontend Setup

### Install Dependencies
Open a **new terminal** (keep backend running) and run:

```bash
cd frontend
npm install
```

### Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## Step 4: Create Your First User

### Option A: Using the Registration Page

1. Open your browser and go to: `http://localhost:3000/register`
2. Fill in the form:
   - **Name:** Admin User
   - **Email:** admin@school.com
   - **Password:** admin123
   - **Role:** admin
3. Click "Create Account"
4. You'll be redirected to the login page

### Option B: Using PowerShell Script

You can use the existing test script to register a user:

```powershell
.\test-registration.ps1
```

---

## Step 5: Login

1. Go to: `http://localhost:3000/login`
2. Enter your credentials:
   - **Email:** admin@school.com
   - **Password:** admin123
3. Click "Sign In"
4. You'll be redirected to the dashboard

---

## Step 6: Add Students and Teachers

### Add a Student

1. Navigate to the Students page from the sidebar or go to: `http://localhost:3000/students`
2. Click the **"Add Student"** button
3. Fill in the student form with required fields:
   - First Name
   - Last Name
   - Email
   - Student ID
   - Roll Number
   - Admission Date
   - Date of Birth
   - Admission Class
   - Present Class
   - Section
4. Optionally fill in parent information
5. Click **"Add Student"**
6. The student will be saved to the database and appear in the list!

### Add a Teacher

1. Navigate to the Teachers page or go to: `http://localhost:3000/teachers`
2. Click the **"Add Teacher"** button
3. Fill in the teacher form with required fields:
   - First Name
   - Last Name
   - Email
   - Employee ID
   - Department
   - Phone
   - Date of Birth
   - Gender
   - Address, City, State, Postal Code
   - Hire Date
   - Salary
4. Click **"Add Teacher"**
5. The teacher will be saved to the database and appear in the list!

**Note:** When you create a teacher, the system automatically creates a user account for them with the role "teacher" and a default password (firstname + last 4 digits of employee ID).

---

## Troubleshooting

### Issue: "No token" or "Invalid token" error

**Solution:** Make sure you're logged in. If the issue persists:
1. Open browser Developer Tools (F12)
2. Go to Application/Storage → Local Storage
3. Clear the `token` item
4. Refresh the page and log in again

### Issue: Cannot connect to database

**Solution:** 
1. Verify PostgreSQL is running
2. Check the database credentials in `backend/.env`
3. Ensure the database `school_mgmt` exists
4. Try connecting with psql or pgAdmin using the same credentials

### Issue: "CORS error" when calling API

**Solution:** The backend is configured to allow all CORS requests in development mode. Make sure:
1. Backend is running on port 4000
2. Frontend is running on port 3000
3. Check the API baseURL in `frontend/src/services/api.ts` (should be `http://localhost:4000/api`)

### Issue: Backend restarts and loses all data

**Solution:** This is expected behavior during development. The backend uses `sequelize.sync({ force: true })` which recreates tables on startup. To preserve data:
1. Change `force: true` to `force: false` in `backend/src/app.ts` line 36
2. Restart the backend server

### Issue: "Role not found" or "Permission denied" errors

**Solution:** 
1. Make sure the backend successfully seeded the roles and permissions (check backend console logs)
2. Try registering a new user with role "admin"
3. If still having issues, restart the backend server to re-seed the database

### Issue: Forms not submitting

**Solution:**
1. Open browser Developer Tools (F12) → Console tab
2. Check for any JavaScript errors
3. Verify you're logged in (token exists in localStorage)
4. Check Network tab to see if the API request is being made
5. If API returns 401/403, you may need to re-login

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Staff (Teachers)
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create new staff member
- `GET /api/staff/:id` - Get staff by ID
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

**Note:** All endpoints except `/api/auth/*` require authentication (Bearer token in Authorization header).

---

## Files Modified

Here are the files I fixed:

### Frontend
1. **`frontend/src/pages/students.tsx`**
   - Uncommented API import
   - Changed `loadStudents()` to call real API instead of mock data
   - Changed `handleSubmit()` to call `studentAPI.create()` instead of mock save
   - Fixed CSS warning

2. **`frontend/src/pages/teachers.tsx`**
   - Uncommented API import
   - Fixed `loadTeachers()` to properly map backend staff data
   - Added form state management (saving, saveError, errors)
   - Added `handleSubmit()` function to handle form submission
   - Added name attributes to all form fields
   - Added error handling and validation
   - Connected submit button to form
   - Added additional required fields (DOB, gender, address, etc.)

3. **`frontend/src/pages/login.tsx`**
   - Changed from mock login to real API call using `authAPI.login()`
   - Added proper error handling
   - Store real JWT token instead of 'demo-token'

### Backend
4. **`backend/.env`** (created)
   - Created from `env.example` with database and JWT configuration

---

## Next Steps

Now that everything is connected:
1. ✅ Login with your admin account
2. ✅ Add some students
3. ✅ Add some teachers
4. ✅ Explore other features (classes, subjects, attendance, etc.)

If you encounter any issues, refer to the Troubleshooting section above or check the browser console and backend logs for error messages.

---

## Development Notes

- Backend auto-restarts with file changes (using ts-node-dev)
- Frontend auto-refreshes with hot reload (using Next.js)
- All API requests automatically include the JWT token from localStorage
- User permissions are enforced on the backend for all routes

Happy coding! 🎓📚

