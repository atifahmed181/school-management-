import { Request, Response } from 'express';
import { Exam, ExamResult } from '../models/exam';
import { Class } from '../models/class';
import { Subject } from '../models/subject';
import { Student } from '../models/student';
import { Op } from 'sequelize';

export class ExamController {
  // Create a new exam
  static async create(req: Request, res: Response) {
    try {
      const examData = req.body;
      
      // Validate required fields
      if (!examData.name || !examData.examType || !examData.classId || !examData.subjectId || 
          !examData.examDate || !examData.startTime || !examData.endTime || 
          !examData.totalMarks || !examData.passingMarks) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate class exists
      const classExists = await Class.findByPk(examData.classId);
      if (!classExists) {
        return res.status(400).json({ error: 'Class not found' });
      }

      // Validate subject exists
      const subjectExists = await Subject.findByPk(examData.subjectId);
      if (!subjectExists) {
        return res.status(400).json({ error: 'Subject not found' });
      }

      // Check if exam already exists for this class, subject, and date
      const existingExam = await Exam.findOne({
        where: {
          classId: examData.classId,
          subjectId: examData.subjectId,
          examDate: examData.examDate,
          examType: examData.examType
        }
      });

      if (existingExam) {
        return res.status(400).json({ error: 'Exam already exists for this class, subject, and date' });
      }

      const newExam = await Exam.create(examData);
      
      res.status(201).json({
        message: 'Exam created successfully',
        exam: newExam
      });
    } catch (error) {
      console.error('Error creating exam:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all exams with optional filters
  static async getAll(req: Request, res: Response) {
    try {
      const { 
        classId, 
        subjectId, 
        examType, 
        status, 
        dateFrom, 
        dateTo,
        page = 1,
        limit = 10
      } = req.query;

      const whereClause: any = {};
      
      // Apply filters
      if (classId) whereClause.classId = classId;
      if (subjectId) whereClause.subjectId = subjectId;
      if (examType) whereClause.examType = examType;
      if (status) whereClause.status = status;
      if (dateFrom || dateTo) {
        whereClause.examDate = {};
        if (dateFrom) whereClause.examDate[Op.gte] = dateFrom;
        if (dateTo) whereClause.examDate[Op.lte] = dateTo;
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: exams } = await Exam.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'gradeLevel', 'section']
          },
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'name', 'code']
          }
        ],
        limit: Number(limit),
        offset,
        order: [['examDate', 'DESC'], ['startTime', 'ASC']]
      });

      res.json({
        exams,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          pages: Math.ceil(count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching exams:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get exam by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const exam = await Exam.findByPk(id, {
        include: [
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'gradeLevel', 'section']
          },
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'name', 'code']
          },
          {
            model: ExamResult,
            as: 'results',
            include: [
              {
                model: Student,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentId']
              }
            ]
          }
        ]
      });

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      res.json({ exam });
    } catch (error) {
      console.error('Error fetching exam:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update exam
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const exam = await Exam.findByPk(id);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      // Don't allow updating if exam is completed
      if (exam.status === 'completed') {
        return res.status(400).json({ error: 'Cannot update completed exam' });
      }

      await exam.update(updateData);
      
      res.json({
        message: 'Exam updated successfully',
        exam
      });
    } catch (error) {
      console.error('Error updating exam:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete exam
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const exam = await Exam.findByPk(id);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      // Don't allow deleting if exam has results
      const resultCount = await ExamResult.count({ where: { examId: id } });
      if (resultCount > 0) {
        return res.status(400).json({ error: 'Cannot delete exam with existing results' });
      }

      await exam.destroy();
      
      res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
      console.error('Error deleting exam:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Add exam result
  static async addResult(req: Request, res: Response) {
    try {
      const { examId } = req.params;
      const resultData = req.body;
      
      // Validate exam exists
      const exam = await Exam.findByPk(examId);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      // Validate student exists
      const student = await Student.findByPk(resultData.studentId);
      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }

      // Check if result already exists
      const existingResult = await ExamResult.findOne({
        where: { examId, studentId: resultData.studentId }
      });

      if (existingResult) {
        return res.status(400).json({ error: 'Result already exists for this student' });
      }

      // Calculate percentage and grade
      const percentage = (resultData.marksObtained / exam.totalMarks) * 100;
      const status = percentage >= exam.passingMarks ? 'pass' : 'fail';
      
      // Determine grade based on percentage
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C+';
      else if (percentage >= 40) grade = 'C';
      else if (percentage >= 30) grade = 'D';

      const newResult = await ExamResult.create({
        ...resultData,
        examId,
        percentage,
        grade,
        status
      });
      
      res.status(201).json({
        message: 'Exam result added successfully',
        result: newResult
      });
    } catch (error) {
      console.error('Error adding exam result:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get exam results
  static async getResults(req: Request, res: Response) {
    try {
      const { examId } = req.params;
      
      const results = await ExamResult.findAll({
        where: { examId },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentId']
          }
        ],
        order: [['marksObtained', 'DESC']]
      });

      res.json({ results });
    } catch (error) {
      console.error('Error fetching exam results:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get exam statistics
  static async getStats(req: Request, res: Response) {
    try {
      const { examId } = req.params;
      
      const results = await ExamResult.findAll({
        where: { examId }
      });

      if (results.length === 0) {
        return res.json({
          totalStudents: 0,
          presentStudents: 0,
          absentStudents: 0,
          passCount: 0,
          failCount: 0,
          averageMarks: 0,
          averagePercentage: 0,
          gradeDistribution: {}
        });
      }

      const totalStudents = results.length;
      const presentStudents = results.filter(r => !r.isAbsent).length;
      const absentStudents = results.filter(r => r.isAbsent).length;
      const passCount = results.filter(r => r.status === 'pass').length;
      const failCount = results.filter(r => r.status === 'fail').length;
      
      const presentResults = results.filter(r => !r.isAbsent);
      const averageMarks = presentResults.length > 0 
        ? presentResults.reduce((sum, r) => sum + Number(r.marksObtained), 0) / presentResults.length 
        : 0;
      const averagePercentage = presentResults.length > 0 
        ? presentResults.reduce((sum, r) => sum + Number(r.percentage), 0) / presentResults.length 
        : 0;

      // Grade distribution
      const gradeDistribution: any = {};
      results.forEach(result => {
        if (!result.isAbsent) {
          gradeDistribution[result.grade] = (gradeDistribution[result.grade] || 0) + 1;
        }
      });

      res.json({
        totalStudents,
        presentStudents,
        absentStudents,
        passCount,
        failCount,
        averageMarks: Math.round(averageMarks * 100) / 100,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        gradeDistribution
      });
    } catch (error) {
      console.error('Error fetching exam statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search exams
  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const exams = await Exam.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${q}%` } },
            { examType: { [Op.iLike]: `%${q}%` } },
            { venue: { [Op.iLike]: `%${q}%` } }
          ]
        },
        include: [
          {
            model: Class,
            as: 'class',
            attributes: ['id', 'name', 'gradeLevel', 'section']
          },
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['examDate', 'DESC']]
      });

      res.json({ exams });
    } catch (error) {
      console.error('Error searching exams:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 