import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance';
import { authorize } from '../middlewares/auth';

const router = Router();

// Attendance operations with authentication
router.post('/students', authorize(['admin', 'teacher']), AttendanceController.markStudentAttendance);
router.post('/staff', authorize(['admin', 'teacher']), AttendanceController.markStaffAttendance);
router.get('/class/:classId/:date', authorize(['admin', 'teacher', 'user']), AttendanceController.getClassAttendance);
router.get('/range', authorize(['admin', 'teacher']), AttendanceController.getAttendanceByDateRange);
router.get('/stats', authorize(['admin', 'teacher']), AttendanceController.getAttendanceStats);
router.get('/today', authorize(['admin', 'teacher']), AttendanceController.getTodayAttendance);
router.put('/:id', authorize(['admin', 'teacher']), AttendanceController.updateAttendance);
router.delete('/:id', authorize(['admin']), AttendanceController.deleteAttendance);

export default router; 