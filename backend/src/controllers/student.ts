import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/student';
import { Op } from 'sequelize';

// Create a new student
export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentData = req.body;
    
    // Generate unique student ID if not provided
    if (!studentData.studentId) {
      const currentYear = new Date().getFullYear();
      const lastStudent = await Student.findOne({
        where: {
          studentId: {
            [Op.like]: `${currentYear}-%`
          }
        },
        order: [['studentId', 'DESC']]
      });
      
      let nextNumber = 1;
      if (lastStudent) {
        const lastNumber = parseInt(lastStudent.studentId.split('-')[1]);
        nextNumber = lastNumber + 1;
      }
      
      studentData.studentId = `${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
    }

    const student = await Student.create(studentData);
    res.status(201).json({
      success: true,
      data: student,
      message: 'Student created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all students with pagination and filters
export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      class: studentClass,
      status,
      gender
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    // Build where clause for filters
    const whereClause: any = {};
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { middleName: { [Op.iLike]: `%${search}%` } },
        { studentId: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
        { alternatePhone: { [Op.iLike]: `%${search}%` } },
        { fatherName: { [Op.iLike]: `%${search}%` } },
        { motherName: { [Op.iLike]: `%${search}%` } },
        { emergencyContactName: { [Op.iLike]: `%${search}%` } },
        { emergencyContactPhone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (studentClass) {
      whereClause.currentClass = studentClass;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (gender) {
      whereClause.gender = gender;
    }

    const { count, rows } = await Student.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalItems: count,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single student by ID
export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Update a student
export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.update(updateData);
    
    res.json({
      success: true,
      data: student,
      message: 'Student updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete a student
export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.destroy();
    
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get student statistics
export const getStudentStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalStudents = await Student.count();
    const activeStudents = await Student.count({ where: { status: 'active' } });
    const inactiveStudents = await Student.count({ where: { status: 'inactive' } });
    
    // Count by gender
    const maleCount = await Student.count({ where: { gender: 'male' } });
    const femaleCount = await Student.count({ where: { gender: 'female' } });
    
    // Count by class
    const classStats = await Student.findAll({
      attributes: [
        'currentClass',
        [Student.sequelize!.fn('COUNT', Student.sequelize!.col('id')), 'count']
      ],
      group: ['currentClass'],
      order: [['currentClass', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents,
        genderDistribution: {
          male: maleCount,
          female: femaleCount
        },
        classDistribution: classStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Advanced search with specific field filters
export const advancedSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      firstName,
      lastName,
      studentId,
      email,
      phoneNumber,
      fatherName,
      motherName,
      currentClass,
      status,
      gender,
      city,
      state
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    // Build where clause for specific field searches
    const whereClause: any = {};
    
    if (firstName) {
      whereClause.firstName = { [Op.iLike]: `%${firstName}%` };
    }
    
    if (lastName) {
      whereClause.lastName = { [Op.iLike]: `%${lastName}%` };
    }
    
    if (studentId) {
      whereClause.studentId = { [Op.iLike]: `%${studentId}%` };
    }
    
    if (email) {
      whereClause.email = { [Op.iLike]: `%${email}%` };
    }
    
    if (phoneNumber) {
      whereClause[Op.or] = [
        { phoneNumber: { [Op.iLike]: `%${phoneNumber}%` } },
        { alternatePhone: { [Op.iLike]: `%${phoneNumber}%` } }
      ];
    }
    
    if (fatherName) {
      whereClause.fatherName = { [Op.iLike]: `%${fatherName}%` };
    }
    
    if (motherName) {
      whereClause.motherName = { [Op.iLike]: `%${motherName}%` };
    }
    
    if (currentClass) {
      whereClause.currentClass = currentClass;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (gender) {
      whereClause.gender = gender;
    }
    
    if (city) {
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }
    
    if (state) {
      whereClause.state = { [Op.iLike]: `%${state}%` };
    }

    const { count, rows } = await Student.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalItems: count,
        itemsPerPage: Number(limit)
      },
      searchCriteria: req.query
    });
  } catch (error) {
    next(error);
  }
}; 