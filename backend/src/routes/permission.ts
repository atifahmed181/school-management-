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

const router = Router();

// Permission management routes
router.get('/', getAllPermissions);
router.get('/category/:category', getPermissionsByCategory);
router.get('/user/:userId', getUserPermissionsController);
router.get('/users', getAllUsersWithPermissions);
router.post('/', createPermission);
router.post('/user/:userId/assign', assignPermissionsToUser);
router.post('/user/:userId/revoke', revokePermissionsFromUser);

export default router; 