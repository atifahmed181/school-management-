import { Router } from 'express';
import { FeeController } from '../controllers/fee';
import { authorize } from '../middlewares/auth';

const router = Router();

// Fee routes with authentication
router.get('/', authorize(['admin', 'teacher', 'user']), FeeController.getFees);
router.post('/', authorize(['admin']), FeeController.createFee);
router.put('/:id', authorize(['admin']), FeeController.updateFee);
router.delete('/:id', authorize(['admin']), FeeController.deleteFee);

// FeePayment routes with authentication
router.get('/payments', authorize(['admin', 'teacher']), FeeController.getPayments);
router.post('/payments', authorize(['admin', 'teacher']), FeeController.createPayment);
router.get('/payments/:id', authorize(['admin', 'teacher']), FeeController.getPaymentById);
router.get('/student/:studentId', authorize(['admin', 'teacher', 'user']), FeeController.getPaymentsByStudent);

export default router; 