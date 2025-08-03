import { Router } from 'express';
import { ClassController } from '../controllers/class';
import { requirePermission } from '../middlewares/permissions';
import { authorize } from '../middlewares/auth';

const router = Router();

// Create a new class
router.post('/', 
  authorize(['admin', 'teacher']), 
  requirePermission('class:create'), 
  ClassController.create
);

// Get all classes with filters and pagination
router.get('/', 
  authorize(['admin', 'teacher', 'user']), 
  requirePermission('class:read'), 
  ClassController.getAll
);

// Get class by ID
router.get('/:id', 
  authorize(['admin', 'teacher', 'user']), 
  requirePermission('class:read'), 
  ClassController.getById
);

// Update class
router.put('/:id', 
  authorize(['admin', 'teacher']), 
  requirePermission('class:update'), 
  ClassController.update
);

// Delete class
router.delete('/:id', 
  authorize(['admin']), 
  requirePermission('class:delete'), 
  ClassController.delete
);

// Search classes
router.get('/search', 
  authorize(['admin', 'teacher', 'user']), 
  requirePermission('class:read'), 
  ClassController.search
);

// Get class statistics
router.get('/stats/overview', 
  authorize(['admin', 'teacher']), 
  requirePermission('class:read'), 
  ClassController.getStats
);

export default router; 