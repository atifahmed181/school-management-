import express, { Request, Response, NextFunction } from 'express';
import { sequelize, Role, Permission } from './models';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import permissionRoutes from './routes/permission';
import classRoutes from './routes/class';
import staffRoutes from './routes/staff';
import attendanceRoutes from './routes/attendance';
import subjectRoutes from './routes/subject';
import feeRoutes from './routes/fee';
import examRoutes from './routes/exam';
import reportRoutes from './routes/report';
import dashboardRoutes from './routes/dashboard';
import { config } from './config';
import cors from 'cors';
import { authorize } from './middlewares/auth';

const app = express();
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

sequelize.sync({ force: true }).then(async () => {
  console.log('Tables created');
  
  // Seed roles
  await Role.findOrCreate({ where: { name: 'admin' } });
  await Role.findOrCreate({ where: { name: 'teacher' } });
  await Role.findOrCreate({ where: { name: 'user' } });
  console.log('Roles seeded');
  
  // Seed default permissions
  const defaultPermissions = [
    // Student permissions
    { name: 'student:create', displayName: 'Create Students', category: 'students', description: 'Can create new students' },
    { name: 'student:read', displayName: 'Read Students', category: 'students', description: 'Can view student information' },
    { name: 'student:update', displayName: 'Update Students', category: 'students', description: 'Can update student information' },
    { name: 'student:delete', displayName: 'Delete Students', category: 'students', description: 'Can delete students' },
    { name: 'student:search', displayName: 'Search Students', category: 'students', description: 'Can search students' },
    
    // Class permissions
    { name: 'class:create', displayName: 'Create Classes', category: 'classes', description: 'Can create new classes' },
    { name: 'class:read', displayName: 'Read Classes', category: 'classes', description: 'Can view class information' },
    { name: 'class:update', displayName: 'Update Classes', category: 'classes', description: 'Can update class information' },
    { name: 'class:delete', displayName: 'Delete Classes', category: 'classes', description: 'Can delete classes' },
    
    // Attendance permissions
    { name: 'attendance:create', displayName: 'Create Attendance', category: 'attendance', description: 'Can mark attendance' },
    { name: 'attendance:read', displayName: 'Read Attendance', category: 'attendance', description: 'Can view attendance records' },
    { name: 'attendance:update', displayName: 'Update Attendance', category: 'attendance', description: 'Can update attendance records' },
    { name: 'attendance:report', displayName: 'Attendance Reports', category: 'attendance', description: 'Can generate attendance reports' },
    
    // User management permissions
    { name: 'user:create', displayName: 'Create Users', category: 'users', description: 'Can create new users' },
    { name: 'user:read', displayName: 'Read Users', category: 'users', description: 'Can view user information' },
    { name: 'user:update', displayName: 'Update Users', category: 'users', description: 'Can update user information' },
    { name: 'user:delete', displayName: 'Delete Users', category: 'users', description: 'Can delete users' },
    { name: 'user:assign_permissions', displayName: 'Assign Permissions', category: 'users', description: 'Can assign permissions to users' },
    
    // Permission management
    { name: 'permission:manage', displayName: 'Manage Permissions', category: 'permissions', description: 'Can manage system permissions' },
    
    // Exam permissions
    { name: 'exam:create', displayName: 'Create Exams', category: 'exams', description: 'Can create new exams' },
    { name: 'exam:read', displayName: 'Read Exams', category: 'exams', description: 'Can view exam information' },
    { name: 'exam:update', displayName: 'Update Exams', category: 'exams', description: 'Can update exam information' },
    { name: 'exam:delete', displayName: 'Delete Exams', category: 'exams', description: 'Can delete exams' },
    
    // Report permissions
    { name: 'report:read', displayName: 'Read Reports', category: 'reports', description: 'Can view reports' },
    
    // Dashboard permissions
    { name: 'dashboard:read', displayName: 'Read Dashboard', category: 'dashboard', description: 'Can view dashboard' }
  ];
  
  for (const permission of defaultPermissions) {
    await Permission.findOrCreate({
      where: { name: permission.name },
      defaults: permission as any
    });
  }
  console.log('Permissions seeded');
  
  sequelize.authenticate()
    .then(() => {
      console.log('DB connected');
      app.listen(config.port, () => console.log(`Server on port ${config.port}`));
    })
    .catch(console.error);
});