import { Router } from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentStats,
  advancedSearch
} from '../controllers/student';
import { requirePermission } from '../middlewares/permissions';
import { authorize } from '../middlewares/auth';

const router = Router();

// Student CRUD routes with authentication and permissions
router.post('/', authorize(['admin', 'teacher']), requirePermission('student:create'), createStudent);
router.get('/', authorize(['admin', 'teacher', 'user']), requirePermission('student:read'), getStudents);
router.get('/search', authorize(['admin', 'teacher', 'user']), requirePermission('student:read'), advancedSearch);
router.get('/stats', authorize(['admin', 'teacher']), requirePermission('student:read'), getStudentStats);
router.get('/:id', authorize(['admin', 'teacher', 'user']), requirePermission('student:read'), getStudentById);
router.put('/:id', authorize(['admin', 'teacher']), requirePermission('student:update'), updateStudent);
router.delete('/:id', authorize(['admin']), requirePermission('student:delete'), deleteStudent);

export default router; 