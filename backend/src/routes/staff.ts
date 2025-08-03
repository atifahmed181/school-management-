import { Router } from 'express';
import { StaffController } from '../controllers/staff';
import { authorize } from '../middlewares/auth';

const router = Router();

// Staff CRUD operations with authentication
router.post('/', authorize(['admin']), StaffController.create);
router.get('/', authorize(['admin', 'teacher']), StaffController.getAll);
router.get('/stats', authorize(['admin']), StaffController.getStats);
router.get('/search', authorize(['admin', 'teacher']), StaffController.search);
router.get('/:id', authorize(['admin', 'teacher']), StaffController.getById);
router.put('/:id', authorize(['admin']), StaffController.update);
router.delete('/:id', authorize(['admin']), StaffController.delete);

export default router; 