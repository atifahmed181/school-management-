import { Request, Response, NextFunction } from 'express';
import { Permission, User, UserPermission } from '../models';
import { getUserPermissions } from '../middlewares/permissions';

// Get all permissions
export const getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await Permission.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['displayName', 'ASC']]
    });

    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    next(error);
  }
};

// Get permissions by category
export const getPermissionsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    
    const permissions = await Permission.findAll({
      where: { 
        category,
        isActive: true 
      },
      order: [['displayName', 'ASC']]
    });

    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    next(error);
  }
};

// Get user's permissions
export const getUserPermissionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const permissions = await getUserPermissions(Number(userId));

    res.json({
      success: true,
      data: {
        userId: Number(userId),
        permissions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Assign permissions to user
export const assignPermissionsToUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body; // Array of permission names

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get permission IDs
    const permissionRecords = await Permission.findAll({
      where: {
        name: permissions,
        isActive: true
      }
    });

    if (permissionRecords.length !== permissions.length) {
      return res.status(400).json({
        success: false,
        message: 'Some permissions not found'
      });
    }

    // Create user permissions
    for (const permission of permissionRecords) {
      await UserPermission.findOrCreate({
        where: {
          userId: Number(userId),
          permissionId: permission.id
        },
        defaults: {
          userId: Number(userId),
          permissionId: permission.id,
          isGranted: true
        } as any
      });
    }

    res.json({
      success: true,
      message: 'Permissions assigned successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Revoke permissions from user
export const revokePermissionsFromUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body; // Array of permission names

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get permission IDs
    const permissionRecords = await Permission.findAll({
      where: {
        name: permissions,
        isActive: true
      }
    });

    const permissionIds = permissionRecords.map(p => p.id);

    // Update user permissions to revoked
    await UserPermission.update(
      { isGranted: false },
      {
        where: {
          userId: Number(userId),
          permissionId: permissionIds
        }
      }
    );

    res.json({
      success: true,
      message: 'Permissions revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all users with their permissions
export const getAllUsersWithPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserPermission,
          include: [Permission],
          where: { isGranted: true }
        }
      ]
    });

    const usersWithPermissions = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.userPermissions.map(up => up.permission.name)
    }));

    res.json({
      success: true,
      data: usersWithPermissions
    });
  } catch (error) {
    next(error);
  }
};

// Create a new permission (admin only)
export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, displayName, category, description } = req.body;

    const permission = await Permission.create({
      name,
      displayName,
      category,
      description
    } as any);

    res.status(201).json({
      success: true,
      data: permission,
      message: 'Permission created successfully'
    });
  } catch (error) {
    next(error);
  }
}; 