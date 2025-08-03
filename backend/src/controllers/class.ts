import { Request, Response } from 'express';
import { Class } from '../models/class';
import { User } from '../models/user';
import { Op } from 'sequelize';

export class ClassController {
  // Create a new class
  static async create(req: Request, res: Response) {
    try {
      const classData = req.body;
      
      // Validate required fields
      if (!classData.name || !classData.gradeLevel || !classData.section || !classData.academicYear || !classData.capacity) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if class already exists
      const existingClass = await Class.findOne({
        where: {
          gradeLevel: classData.gradeLevel,
          section: classData.section,
          academicYear: classData.academicYear
        }
      });

      if (existingClass) {
        return res.status(400).json({ error: 'Class already exists for this grade, section, and academic year' });
      }

      // Validate teacher if provided
      if (classData.teacherId) {
        const teacher = await User.findOne({
          where: { id: classData.teacherId, role: 'teacher' }
        });
        if (!teacher) {
          return res.status(400).json({ error: 'Invalid teacher ID' });
        }
      }

      const newClass = await Class.create({
        ...classData,
        currentEnrollment: 0
      });
      
      res.status(201).json({
        message: 'Class created successfully',
        class: newClass
      });
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all classes with optional filters
  static async getAll(req: Request, res: Response) {
    try {
      const { 
        gradeLevel, 
        academicYear, 
        isActive, 
        teacherId,
        page = 1,
        limit = 10
      } = req.query;

      const whereClause: any = {};
      
      // Apply filters
      if (gradeLevel) whereClause.gradeLevel = gradeLevel;
      if (academicYear) whereClause.academicYear = academicYear;
      if (isActive !== undefined) whereClause.isActive = isActive === 'true';
      if (teacherId) whereClause.teacherId = teacherId;

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: classes } = await Class.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'name', 'email']
          }
        ],
        limit: Number(limit),
        offset,
        order: [['gradeLevel', 'ASC'], ['section', 'ASC']]
      });

      res.json({
        classes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          pages: Math.ceil(count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get class by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const classData = await Class.findByPk(Number(id), {
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      res.json({ class: classData });
    } catch (error) {
      console.error('Error fetching class:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update class
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const classData = await Class.findByPk(Number(id));

      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      // Validate teacher if provided
      if (updateData.teacherId) {
        const teacher = await User.findOne({
          where: { id: updateData.teacherId, role: 'teacher' }
        });
        if (!teacher) {
          return res.status(400).json({ error: 'Invalid teacher ID' });
        }
      }

      // Check capacity vs current enrollment
      if (updateData.capacity && updateData.capacity < classData.currentEnrollment) {
        return res.status(400).json({ 
          error: 'Capacity cannot be less than current enrollment' 
        });
      }

      await classData.update(updateData);
      
      const updatedClass = await Class.findByPk(Number(id), {
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.json({
        message: 'Class updated successfully',
        class: updatedClass
      });
    } catch (error) {
      console.error('Error updating class:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete class
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const classData = await Class.findByPk(Number(id));

      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      // Check if class has students enrolled
      if (classData.currentEnrollment > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete class with enrolled students' 
        });
      }

      await classData.destroy();
      
      res.json({ message: 'Class deleted successfully' });
    } catch (error) {
      console.error('Error deleting class:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search classes
  static async search(req: Request, res: Response) {
    try {
      const { q, gradeLevel, academicYear, isActive } = req.query;
      
      const whereClause: any = {};

      if (q) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${q}%` } },
          { gradeLevel: { [Op.iLike]: `%${q}%` } },
          { section: { [Op.iLike]: `%${q}%` } },
          { roomNumber: { [Op.iLike]: `%${q}%` } }
        ];
      }

      if (gradeLevel) whereClause.gradeLevel = gradeLevel;
      if (academicYear) whereClause.academicYear = academicYear;
      if (isActive !== undefined) whereClause.isActive = isActive === 'true';

      const classes = await Class.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['gradeLevel', 'ASC'], ['section', 'ASC']]
      });

      res.json({ classes });
    } catch (error) {
      console.error('Error searching classes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get class statistics
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await Class.findOne({
        attributes: [
          [Class.sequelize!.fn('COUNT', Class.sequelize!.col('id')), 'totalClasses'],
          [Class.sequelize!.fn('SUM', Class.sequelize!.literal('CASE WHEN "isActive" = true THEN 1 ELSE 0 END')), 'activeClasses'],
          [Class.sequelize!.fn('SUM', Class.sequelize!.col('currentEnrollment')), 'totalEnrollment'],
          [Class.sequelize!.fn('SUM', Class.sequelize!.col('capacity')), 'totalCapacity']
        ]
      });

      const gradeLevelStats = await Class.findAll({
        attributes: [
          'gradeLevel',
          [Class.sequelize!.fn('COUNT', Class.sequelize!.col('id')), 'classCount'],
          [Class.sequelize!.fn('SUM', Class.sequelize!.col('currentEnrollment')), 'totalEnrollment'],
          [Class.sequelize!.fn('SUM', Class.sequelize!.col('capacity')), 'totalCapacity']
        ],
        group: ['gradeLevel'],
        order: [['gradeLevel', 'ASC']]
      });

      res.json({
        overall: stats,
        byGradeLevel: gradeLevelStats
      });
    } catch (error) {
      console.error('Error fetching class stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}