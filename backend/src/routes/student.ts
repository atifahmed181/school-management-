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

const router = Router();

// Student CRUD routes with permissions
router.post('/', requirePermission('students.create'), createStudent);
router.get('/', requirePermission('students.read'), getStudents);
router.get('/search', requirePermission('students.read'), advancedSearch);
router.get('/stats', requirePermission('students.read'), getStudentStats);
router.get('/:id', requirePermission('students.read'), getStudentById);
router.put('/:id', requirePermission('students.update'), updateStudent);
router.delete('/:id', requirePermission('students.delete'), deleteStudent);

export default router; 