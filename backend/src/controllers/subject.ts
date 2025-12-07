import { Request, Response } from 'express';
import { Subject } from '../models';
import { Op } from 'sequelize';

export class SubjectController {
  // Create a new subject
  static async create(req: Request, res: Response) {
    try {
      const subjectData = req.body;

      // Validate required fields
      const requiredFields = ['name', 'code', 'category', 'credits'];
      for (const field of requiredFields) {
        if (!subjectData[field]) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }

      // Check if subject code already exists
      const existingSubject = await Subject.findOne({
        where: { code: subjectData.code }
      });

      if (existingSubject) {
        return res.status(400).json({ error: 'Subject code already exists' });
      }

      const newSubject = await Subject.create(subjectData);

      res.status(201).json({
        message: 'Subject created successfully',
        subject: newSubject
      });
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all subjects with pagination and search
  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, category, department, gradeLevel, isActive } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (category) {
        whereClause.category = category;
      }

      if (department) {
        whereClause.department = department;
      }

      if (gradeLevel) {
        whereClause.gradeLevel = gradeLevel;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const { count, rows } = await Subject.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset,
        order: [['name', 'ASC']]
      });

      res.json({
        subjects: rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalItems: count,
          itemsPerPage: Number(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get subject by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const subject = await Subject.findByPk(id);

      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      res.json({ subject });
    } catch (error) {
      console.error('Error fetching subject:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update subject
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Check if code is being changed and if it already exists
      if (updateData.code && updateData.code !== subject.code) {
        const existingSubject = await Subject.findOne({
          where: { code: updateData.code }
        });

        if (existingSubject) {
          return res.status(400).json({ error: 'Subject code already exists' });
        }
      }

      await subject.update(updateData);

      res.json({
        message: 'Subject updated successfully',
        subject
      });
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete subject
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      await subject.destroy();

      res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get subjects by category
  static async getByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;

      const subjects = await Subject.findAll({
        where: { category, isActive: true },
        order: [['name', 'ASC']]
      });

      res.json({ subjects });
    } catch (error) {
      console.error('Error fetching subjects by category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get subjects by department
  static async getByDepartment(req: Request, res: Response) {
    try {
      const { department } = req.params;

      const subjects = await Subject.findAll({
        where: { department, isActive: true },
        order: [['name', 'ASC']]
      });

      res.json({ subjects });
    } catch (error) {
      console.error('Error fetching subjects by department:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get subjects by grade level
  static async getByGradeLevel(req: Request, res: Response) {
    try {
      const { gradeLevel } = req.params;

      const subjects = await Subject.findAll({
        where: { gradeLevel, isActive: true },
        order: [['name', 'ASC']]
      });

      res.json({ subjects });
    } catch (error) {
      console.error('Error fetching subjects by grade level:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search subjects
  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const subjects = await Subject.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${q}%` } },
            { code: { [Op.iLike]: `%${q}%` } },
            { description: { [Op.iLike]: `%${q}%` } },
            { department: { [Op.iLike]: `%${q}%` } }
          ],
          isActive: true
        },
        order: [['name', 'ASC']],
        limit: 20
      });

      res.json({ subjects });
    } catch (error) {
      console.error('Error searching subjects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get subject statistics
  static async getStats(req: Request, res: Response) {
    try {
      const totalSubjects = await Subject.count();
      const activeSubjects = await Subject.count({ where: { isActive: true } });
      const coreSubjects = await Subject.count({ where: { category: 'Core' } });
      const electiveSubjects = await Subject.count({ where: { category: 'Elective' } });

      const departmentStats = await Subject.findAll({
        attributes: [
          'department',
          [Subject.sequelize!.fn('COUNT', Subject.sequelize!.col('id')), 'count']
        ],
        where: { department: { [Op.not]: null as any } },
        group: ['department']
      });

      res.json({
        totalSubjects,
        activeSubjects,
        coreSubjects,
        electiveSubjects,
        departmentStats
      });
    } catch (error) {
      console.error('Error fetching subject statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 