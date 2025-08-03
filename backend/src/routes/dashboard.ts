import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard';
import { authorize } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permissions';

const router = Router();

// Dashboard routes with authentication and permissions
router.get('/admin', authorize(['admin']), requirePermission('dashboard:read'), DashboardController.getAdminDashboard);
router.get('/teacher', authorize(['teacher']), requirePermission('dashboard:read'), DashboardController.getTeacherDashboard);
router.get('/student', authorize(['user']), requirePermission('dashboard:read'), DashboardController.getStudentDashboard);
router.get('/parent', authorize(['user']), requirePermission('dashboard:read'), DashboardController.getParentDashboard);
router.get('/analytics', authorize(['admin', 'teacher']), requirePermission('dashboard:read'), DashboardController.getAnalytics);

export default router; 