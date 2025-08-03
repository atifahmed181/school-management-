import { Router } from 'express';
import { ReportController } from '../controllers/report';
import { authorize } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permissions';

const router = Router();

// Report routes with authentication and permissions
router.get('/dashboard/overview', authorize(['admin', 'teacher']), requirePermission('report:read'), ReportController.getDashboardOverview);
router.get('/student/performance', authorize(['admin', 'teacher', 'user']), requirePermission('report:read'), ReportController.getStudentPerformance);
router.get('/class/performance', authorize(['admin', 'teacher']), requirePermission('report:read'), ReportController.getClassPerformance);
router.get('/attendance', authorize(['admin', 'teacher']), requirePermission('report:read'), ReportController.getAttendanceReport);
router.get('/financial', authorize(['admin']), requirePermission('report:read'), ReportController.getFinancialReport);

export default router; 