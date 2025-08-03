import { Router } from 'express';
import { ExamController } from '../controllers/exam';
import { authorize } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permissions';

const router = Router();

// Exam CRUD routes with authentication and permissions
router.post('/', authorize(['admin', 'teacher']), requirePermission('exam:create'), ExamController.create);
router.get('/', authorize(['admin', 'teacher', 'user']), requirePermission('exam:read'), ExamController.getAll);
router.get('/search', authorize(['admin', 'teacher', 'user']), requirePermission('exam:read'), ExamController.search);
router.get('/:id', authorize(['admin', 'teacher', 'user']), requirePermission('exam:read'), ExamController.getById);
router.put('/:id', authorize(['admin', 'teacher']), requirePermission('exam:update'), ExamController.update);
router.delete('/:id', authorize(['admin']), requirePermission('exam:delete'), ExamController.delete);

// Exam results routes
router.post('/:examId/results', authorize(['admin', 'teacher']), requirePermission('exam:create'), ExamController.addResult);
router.get('/:examId/results', authorize(['admin', 'teacher', 'user']), requirePermission('exam:read'), ExamController.getResults);
router.get('/:examId/stats', authorize(['admin', 'teacher']), requirePermission('exam:read'), ExamController.getStats);

export default router; 