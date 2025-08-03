# School Management System - API Summary

## Overview
This document provides a comprehensive overview of all APIs available in the School Management System.

## Base URL
```
http://localhost:4000/api
```

## Authentication
All APIs (except auth endpoints) require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. Authentication API (`/auth`)
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login user and get JWT token

### 2. Students API (`/students`)
- **POST** `/students` - Create a new student
- **GET** `/students` - Get all students (with filters)
- **GET** `/students/:id` - Get student by ID
- **PUT** `/students/:id` - Update student
- **DELETE** `/students/:id` - Delete student
- **GET** `/students/stats` - Get student statistics
- **GET** `/students/search` - Search students

### 3. Staff API (`/staff`)
- **POST** `/staff` - Create a new staff member
- **GET** `/staff` - Get all staff members (with filters)
- **GET** `/staff/:id` - Get staff by ID
- **PUT** `/staff/:id` - Update staff member
- **DELETE** `/staff/:id` - Delete staff member
- **GET** `/staff/stats` - Get staff statistics
- **GET** `/staff/search` - Search staff members

### 4. Classes API (`/classes`)
- **POST** `/classes` - Create a new class
- **GET** `/classes` - Get all classes (with filters)
- **GET** `/classes/:id` - Get class by ID
- **PUT** `/classes/:id` - Update class
- **DELETE** `/classes/:id` - Delete class
- **GET** `/classes/search` - Search classes
- **GET** `/classes/stats/overview` - Get class statistics

### 5. Subjects API (`/subjects`)
- **POST** `/subjects` - Create a new subject
- **GET** `/subjects` - Get all subjects (with filters)
- **GET** `/subjects/:id` - Get subject by ID
- **PUT** `/subjects/:id` - Update subject
- **DELETE** `/subjects/:id` - Delete subject
- **GET** `/subjects/stats` - Get subject statistics
- **GET** `/subjects/grade/:gradeLevel` - Get subjects by grade level

### 6. Attendance API (`/attendance`)
- **POST** `/attendance` - Mark attendance
- **GET** `/attendance` - Get attendance records (with filters)
- **GET** `/attendance/:id` - Get attendance by ID
- **PUT** `/attendance/:id` - Update attendance
- **DELETE** `/attendance/:id` - Delete attendance
- **GET** `/attendance/today` - Get today's attendance
- **GET** `/attendance/class/:classId/:date` - Get class attendance for date
- **GET** `/attendance/range` - Get attendance by date range
- **GET** `/attendance/stats` - Get attendance statistics

### 7. Fees API (`/fees`)
- **POST** `/fees` - Create a new fee type
- **GET** `/fees` - Get all fee types
- **GET** `/fees/:id` - Get fee type by ID
- **PUT** `/fees/:id` - Update fee type
- **DELETE** `/fees/:id` - Delete fee type
- **POST** `/fees/:id/payments` - Record fee payment
- **GET** `/fees/:id/payments` - Get payments for fee type
- **GET** `/fees/payments` - Get all fee payments
- **GET** `/fees/payments/:id` - Get payment by ID
- **PUT** `/fees/payments/:id` - Update payment
- **GET** `/fees/stats` - Get fee statistics

### 8. Exams API (`/exams`) - NEW
- **POST** `/exams` - Create a new exam
- **GET** `/exams` - Get all exams (with filters)
- **GET** `/exams/:id` - Get exam by ID
- **PUT** `/exams/:id` - Update exam
- **DELETE** `/exams/:id` - Delete exam
- **GET** `/exams/search` - Search exams
- **POST** `/exams/:examId/results` - Add exam result
- **GET** `/exams/:examId/results` - Get exam results
- **GET** `/exams/:examId/stats` - Get exam statistics

### 9. Reports API (`/reports`) - NEW
- **GET** `/reports/dashboard/overview` - Get dashboard overview report
- **GET** `/reports/student/performance` - Get student performance report
- **GET** `/reports/class/performance` - Get class performance report
- **GET** `/reports/attendance` - Get attendance report
- **GET** `/reports/financial` - Get financial report

### 10. Dashboard API (`/dashboard`) - NEW
- **GET** `/dashboard/admin` - Get admin dashboard data
- **GET** `/dashboard/teacher` - Get teacher dashboard data
- **GET** `/dashboard/student` - Get student dashboard data
- **GET** `/dashboard/analytics` - Get analytics data

### 11. Permissions API (`/permissions`)
- **GET** `/permissions` - Get all permissions
- **GET** `/permissions/:id` - Get permission by ID
- **POST** `/permissions` - Create new permission
- **PUT** `/permissions/:id` - Update permission
- **DELETE** `/permissions/:id` - Delete permission
- **POST** `/permissions/:id/assign` - Assign permission to user
- **DELETE** `/permissions/:id/assign` - Remove permission from user

## Data Models

### Core Models
1. **User** - System users with roles
2. **Role** - User roles (admin, teacher, user)
3. **Permission** - System permissions
4. **UserPermission** - User-permission relationships

### Academic Models
5. **Student** - Student information
6. **Staff** - Staff/teacher information
7. **Class** - Class information
8. **Subject** - Subject information
9. **Attendance** - Attendance records
10. **Exam** - Exam information
11. **ExamResult** - Exam results and grades

### Financial Models
12. **Fee** - Fee types and amounts
13. **FeePayment** - Fee payment records

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Permission-based authorization
- Secure password hashing

### Data Management
- Full CRUD operations for all entities
- Advanced search and filtering
- Pagination support
- Data validation and error handling

### Reporting & Analytics
- Comprehensive reporting system
- Dashboard analytics
- Performance tracking
- Financial reporting
- Attendance analytics

### Security Features
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting (can be added)
- Audit logging (can be added)

## Testing

### Test Scripts Available
1. `test-all-apis-with-auth.ps1` - Comprehensive API testing with authentication
2. `test-new-apis.ps1` - Testing for new APIs (Exams, Reports, Dashboard)
3. `test-classes-api.ps1` - Classes API testing
4. `test-staff-api.ps1` - Staff API testing
5. `test-subjects-api.ps1` - Subjects API testing
6. `test-attendance-api.ps1` - Attendance API testing
7. `test-fees-api.ps1` - Fees API testing

## Getting Started

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the APIs:**
   ```bash
   # Run comprehensive tests
   ./test-all-apis-with-auth.ps1
   
   # Test new APIs
   ./test-new-apis.ps1
   ```

3. **Access the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## API Status
✅ **Complete** - All core APIs implemented and tested
✅ **Authentication** - JWT authentication implemented
✅ **Authorization** - Role and permission-based access control
✅ **Validation** - Input validation and error handling
✅ **Documentation** - Comprehensive API documentation

## Next Steps
- Add rate limiting
- Implement audit logging
- Add file upload functionality
- Create more detailed reports
- Add email notifications
- Implement real-time notifications (WebSocket) 