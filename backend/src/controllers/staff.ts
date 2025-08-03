import { Request, Response } from 'express';
import { Staff, User, Role } from '../models';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

export class StaffController {
  // Create a new staff member
  static async create(req: Request, res: Response) {
    try {
      const staffData = req.body;
      
      // Validate required fields
      const requiredFields = ['employeeId', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'phoneNumber', 'email', 'address', 'city', 'state', 'postalCode', 'hireDate', 'position'];
      for (const field of requiredFields) {
        if (!staffData[field]) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }

      // Check if employee ID already exists
      const existingStaff = await Staff.findOne({
        where: { employeeId: staffData.employeeId }
      });

      if (existingStaff) {
        return res.status(400).json({ error: 'Employee ID already exists' });
      }

      // Check if email already exists in Staff table
      const existingStaffEmail = await Staff.findOne({
        where: { email: staffData.email }
      });

      if (existingStaffEmail) {
        return res.status(400).json({ error: 'Email already exists in staff records' });
      }

      // Check if email already exists in User table
      const existingUserEmail = await User.findOne({
        where: { email: staffData.email }
      });

      if (existingUserEmail) {
        return res.status(400).json({ error: 'Email already exists in user accounts' });
      }

      // Get the teacher role
      const teacherRole = await Role.findOne({
        where: { name: 'teacher' }
      });

      if (!teacherRole) {
        return res.status(500).json({ error: 'Teacher role not found in system' });
      }

      // Generate a default password (first name + last 4 digits of employee ID)
      const defaultPassword = `${staffData.firstName.toLowerCase()}${staffData.employeeId.slice(-4)}`;
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      // Create the user account
      const newUser = new User({ 
        name: `${staffData.firstName} ${staffData.lastName}`,
        email: staffData.email,
        passwordHash: passwordHash,
        roleId: teacherRole.id 
      } as any);
      await newUser.save();

      // Create the staff member with the user ID
      const newStaff = await Staff.create({
        ...staffData,
        userId: newUser.id
      });
      
      res.status(201).json({
        message: 'Staff member created successfully',
        staff: newStaff,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: teacherRole.name
        },
        defaultPassword: defaultPassword,
        note: 'User account created with default password. Please change password on first login.'
      });
    } catch (error) {
      console.error('Error creating staff member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all staff members with pagination and search
  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, position, status, department } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      
      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { employeeId: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (position) {
        whereClause.position = position;
      }

      if (status) {
        whereClause.status = status;
      }

      if (department) {
        whereClause.department = department;
      }

      const { count, rows } = await Staff.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        ],
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        staff: rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching staff members:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get staff member by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const staff = await Staff.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      res.json({ staff });
    } catch (error) {
      console.error('Error fetching staff member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update staff member
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const staff = await Staff.findByPk(id);
      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      // Check if employee ID is being changed and if it already exists
      if (updateData.employeeId && updateData.employeeId !== staff.employeeId) {
        const existingStaff = await Staff.findOne({
          where: { employeeId: updateData.employeeId }
        });

        if (existingStaff) {
          return res.status(400).json({ error: 'Employee ID already exists' });
        }
      }

      // Check if email is being changed and if it already exists
      if (updateData.email && updateData.email !== staff.email) {
        const existingEmail = await Staff.findOne({
          where: { email: updateData.email }
        });

        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      await staff.update(updateData);
      
      res.json({
        message: 'Staff member updated successfully',
        staff
      });
    } catch (error) {
      console.error('Error updating staff member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete staff member
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const staff = await Staff.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id']
          }
        ]
      });
      
      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      // Delete the associated user account if it exists
      if (staff.userId && staff.user) {
        await staff.user.destroy();
      }

      await staff.destroy();
      
      res.json({ message: 'Staff member and associated user account deleted successfully' });
    } catch (error) {
      console.error('Error deleting staff member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get staff statistics
  static async getStats(req: Request, res: Response) {
    try {
      const totalStaff = await Staff.count();
      const activeStaff = await Staff.count({ where: { status: 'active' } });
      const teachers = await Staff.count({ where: { position: 'Teacher' } });
      const admins = await Staff.count({ where: { position: 'Admin' } });

      const departmentStats = await Staff.findAll({
        attributes: [
          'department',
          [Staff.sequelize!.fn('COUNT', Staff.sequelize!.col('id')), 'count']
        ],
        where: { department: { [Op.ne]: null as any } },
        group: ['department']
      });

      res.json({
        totalStaff,
        activeStaff,
        teachers,
        admins,
        departmentStats
      });
    } catch (error) {
      console.error('Error fetching staff statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search staff members
  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const staff = await Staff.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${q}%` } },
            { lastName: { [Op.iLike]: `%${q}%` } },
            { employeeId: { [Op.iLike]: `%${q}%` } },
            { email: { [Op.iLike]: `%${q}%` } },
            { position: { [Op.iLike]: `%${q}%` } }
          ]
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        ],
        limit: 20
      });

      res.json({ staff });
    } catch (error) {
      console.error('Error searching staff members:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 