import express, { Request, Response, NextFunction } from 'express';
import { sequelize, Role, Permission } from './models';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import permissionRoutes from './routes/permission';
import { config } from './config';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/permissions', permissionRoutes);

sequelize.sync({ force: true }).then(async () => {
  console.log('Tables created');
  
  // Seed roles
  await Role.findOrCreate({ where: { name: 'admin' } });
  await Role.findOrCreate({ where: { name: 'user' } });
  console.log('Roles seeded');
  
  // Seed default permissions
  const defaultPermissions = [
    // Student permissions
    { name: 'students.create', displayName: 'Create Students', category: 'students', description: 'Can create new students' },
    { name: 'students.read', displayName: 'Read Students', category: 'students', description: 'Can view student information' },
    { name: 'students.update', displayName: 'Update Students', category: 'students', description: 'Can update student information' },
    { name: 'students.delete', displayName: 'Delete Students', category: 'students', description: 'Can delete students' },
    { name: 'students.search', displayName: 'Search Students', category: 'students', description: 'Can search students' },
    
    // Class permissions
    { name: 'classes.create', displayName: 'Create Classes', category: 'classes', description: 'Can create new classes' },
    { name: 'classes.read', displayName: 'Read Classes', category: 'classes', description: 'Can view class information' },
    { name: 'classes.update', displayName: 'Update Classes', category: 'classes', description: 'Can update class information' },
    { name: 'classes.delete', displayName: 'Delete Classes', category: 'classes', description: 'Can delete classes' },
    
    // Attendance permissions
    { name: 'attendance.create', displayName: 'Create Attendance', category: 'attendance', description: 'Can mark attendance' },
    { name: 'attendance.read', displayName: 'Read Attendance', category: 'attendance', description: 'Can view attendance records' },
    { name: 'attendance.update', displayName: 'Update Attendance', category: 'attendance', description: 'Can update attendance records' },
    { name: 'attendance.report', displayName: 'Attendance Reports', category: 'attendance', description: 'Can generate attendance reports' },
    
    // User management permissions
    { name: 'users.create', displayName: 'Create Users', category: 'users', description: 'Can create new users' },
    { name: 'users.read', displayName: 'Read Users', category: 'users', description: 'Can view user information' },
    { name: 'users.update', displayName: 'Update Users', category: 'users', description: 'Can update user information' },
    { name: 'users.delete', displayName: 'Delete Users', category: 'users', description: 'Can delete users' },
    { name: 'users.assign_permissions', displayName: 'Assign Permissions', category: 'users', description: 'Can assign permissions to users' },
    
    // Permission management
    { name: 'permissions.manage', displayName: 'Manage Permissions', category: 'permissions', description: 'Can manage system permissions' }
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