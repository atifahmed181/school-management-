import { Router } from 'express';
import {
  getAllPermissions,
  getPermissionsByCategory,
  getUserPermissionsController,
  assignPermissionsToUser,
  revokePermissionsFromUser,
  getAllUsersWithPermissions,
  createPermission
} from '../controllers/permission';
import { authorize } from '../middlewares/auth';

const router = Router();

// Permission management routes with authentication
router.get('/', authorize(['admin']), getAllPermissions);
router.get('/category/:category', authorize(['admin']), getPermissionsByCategory);
router.get('/user/:userId', authorize(['admin']), getUserPermissionsController);
router.get('/users', authorize(['admin']), getAllUsersWithPermissions);
router.post('/', authorize(['admin']), createPermission);
router.post('/user/:userId/assign', authorize(['admin']), assignPermissionsToUser);
router.post('/user/:userId/revoke', authorize(['admin']), revokePermissionsFromUser);

export default router; 