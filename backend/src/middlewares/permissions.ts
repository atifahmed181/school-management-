import { Request, Response, NextFunction } from 'express';
import { User, Permission, UserPermission } from '../models';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Check if user has specific permission
export const requirePermission = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user from request (set by auth middleware)
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has the required permission
      const hasPermission = await UserPermission.findOne({
        where: {
          userId: user.id,
          isGranted: true
        },
        include: [{
          model: Permission,
          where: {
            name: permissionName,
            isActive: true
          }
        }]
      });

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Permission denied: ${permissionName}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Check if user has any of the specified permissions
export const requireAnyPermission = (permissionNames: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has any of the required permissions
      const hasPermission = await UserPermission.findOne({
        where: {
          userId: user.id,
          isGranted: true
        },
        include: [{
          model: Permission,
          where: {
            name: permissionNames,
            isActive: true
          }
        }]
      });

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Permission denied: requires one of [${permissionNames.join(', ')}]`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Check if user has all specified permissions
export const requireAllPermissions = (permissionNames: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user has all required permissions
      const userPermissions = await UserPermission.findAll({
        where: {
          userId: user.id,
          isGranted: true
        },
        include: [{
          model: Permission,
          where: {
            name: permissionNames,
            isActive: true
          }
        }]
      });

      const hasAllPermissions = userPermissions.length === permissionNames.length;

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: `Permission denied: requires all of [${permissionNames.join(', ')}]`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Helper function to get user permissions
export const getUserPermissions = async (userId: number): Promise<string[]> => {
  try {
    const userPermissions = await UserPermission.findAll({
      where: {
        userId,
        isGranted: true
      },
      include: [{
        model: Permission,
        where: {
          isActive: true
        }
      }]
    });

    return userPermissions.map(up => up.permission.name);
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}; 