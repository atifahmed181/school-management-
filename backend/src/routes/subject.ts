import { Router } from 'express';
import { SubjectController } from '../controllers/subject';
import { authorize } from '../middlewares/auth';

const router = Router();

// Subject CRUD operations with authentication
router.post('/', authorize(['admin', 'teacher']), SubjectController.create);
router.get('/', authorize(['admin', 'teacher', 'user']), SubjectController.getAll);
router.get('/stats', authorize(['admin', 'teacher']), SubjectController.getStats);
router.get('/search', authorize(['admin', 'teacher', 'user']), SubjectController.search);
router.get('/category/:category', authorize(['admin', 'teacher', 'user']), SubjectController.getByCategory);
router.get('/department/:department', authorize(['admin', 'teacher', 'user']), SubjectController.getByDepartment);
router.get('/grade/:gradeLevel', authorize(['admin', 'teacher', 'user']), SubjectController.getByGradeLevel);
router.get('/:id', authorize(['admin', 'teacher', 'user']), SubjectController.getById);
router.put('/:id', authorize(['admin', 'teacher']), SubjectController.update);
router.delete('/:id', authorize(['admin']), SubjectController.delete);

export default router; 