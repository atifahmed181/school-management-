import { Request, Response } from 'express';
import { Student } from '../models/student';
import { Staff } from '../models/staff';
import { Class } from '../models/class';
import { Attendance } from '../models/attendance';
import { Exam, ExamResult } from '../models/exam';
import { Fee, FeePayment } from '../models';
import { Subject } from '../models/subject';
import { Op } from 'sequelize';
import { sequelize } from '../models';

export class ReportController {
  // Dashboard overview report
  static async getDashboardOverview(req: Request, res: Response) {
    try {
      // Get total counts
      const totalStudents = await Student.count();
      const totalStaff = await Staff.count();
      const totalClasses = await Class.count();
      const totalSubjects = await Subject.count();

      // Get active counts
      const activeStudents = await Student.count({ where: { status: 'active' } });
      const activeStaff = await Staff.count({ where: { status: 'active' } });
      const activeClasses = await Class.count({ where: { isActive: true } });

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = await Attendance.count({
        where: {
          date: today,
          status: 'present'
        }
      });

      // Get recent activities (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentStudents = await Student.count({
        where: {
          createdAt: {
            [Op.gte]: sevenDaysAgo
          }
        }
      });

      const recentStaff = await Staff.count({
        where: {
          createdAt: {
            [Op.gte]: sevenDaysAgo
          }
        }
      });

      // Get fee collection summary
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const monthlyFeeCollection = await FeePayment.sum('amountPaid', {
        where: {
          [Op.and]: [
            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "paymentDate"')), currentMonth),
            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "paymentDate"')), currentYear)
          ]
        }
      });

      res.json({
        overview: {
          totalStudents,
          totalStaff,
          totalClasses,
          totalSubjects,
          activeStudents,
          activeStaff,
          activeClasses
        },
        today: {
          attendance: todayAttendance
        },
        recent: {
          newStudents: recentStudents,
          newStaff: recentStaff
        },
        financial: {
          monthlyCollection: monthlyFeeCollection || 0
        }
      });
    } catch (error) {
      console.error('Error generating dashboard overview:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Student performance report
  static async getStudentPerformance(req: Request, res: Response) {
    try {
      const { studentId, academicYear } = req.query;

      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
      }

      const student = await Student.findByPk(studentId as string);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Get all exam results for the student
      const examResults = await ExamResult.findAll({
        where: { studentId: studentId as string },
        include: [
          {
            model: Exam,
            as: 'exam',
            include: [
              {
                model: Subject,
                as: 'subject',
                attributes: ['id', 'name', 'code']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Calculate performance metrics
      const totalExams = examResults.length;
      const passedExams = examResults.filter(r => r.status === 'pass').length;
      const failedExams = examResults.filter(r => r.status === 'fail').length;
      const absentExams = examResults.filter(r => r.isAbsent).length;

      const averagePercentage = totalExams > 0
        ? examResults.reduce((sum, r) => sum + Number(r.percentage), 0) / totalExams
        : 0;

      // Subject-wise performance
      const subjectPerformance: any = {};
      examResults.forEach(result => {
        const subjectName = result.exam?.subject?.name || 'Unknown';
        if (!subjectPerformance[subjectName]) {
          subjectPerformance[subjectName] = {
            totalExams: 0,
            passedExams: 0,
            averagePercentage: 0,
            totalMarks: 0
          };
        }

        subjectPerformance[subjectName].totalExams++;
        if (result.status === 'pass') {
          subjectPerformance[subjectName].passedExams++;
        }
        subjectPerformance[subjectName].totalMarks += Number(result.percentage);
      });

      // Calculate average for each subject
      Object.keys(subjectPerformance).forEach(subject => {
        const data = subjectPerformance[subject];
        data.averagePercentage = data.totalExams > 0 ? data.totalMarks / data.totalExams : 0;
        delete data.totalMarks;
      });

      res.json({
        student: {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId,
          currentClass: student.currentClass
        },
        performance: {
          totalExams,
          passedExams,
          failedExams,
          absentExams,
          passRate: totalExams > 0 ? (passedExams / totalExams) * 100 : 0,
          averagePercentage: Math.round(averagePercentage * 100) / 100
        },
        subjectPerformance
      });
    } catch (error) {
      console.error('Error generating student performance report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Class performance report
  static async getClassPerformance(req: Request, res: Response) {
    try {
      const { classId, examId } = req.query;

      if (!classId) {
        return res.status(400).json({ error: 'Class ID is required' });
      }

      const classData = await Class.findByPk(classId as string);
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      let examResults;
      if (examId) {
        // Specific exam results
        examResults = await ExamResult.findAll({
          where: { examId: examId as string },
          include: [
            {
              model: Student,
              as: 'student',
              where: { currentClass: classData.name },
              attributes: ['id', 'firstName', 'lastName', 'studentId']
            }
          ]
        });
      } else {
        // All exam results for the class
        examResults = await ExamResult.findAll({
          include: [
            {
              model: Student,
              as: 'student',
              where: { currentClass: classData.name },
              attributes: ['id', 'firstName', 'lastName', 'studentId']
            },
            {
              model: Exam,
              as: 'exam',
              include: [
                {
                  model: Subject,
                  as: 'subject',
                  attributes: ['id', 'name', 'code']
                }
              ]
            }
          ]
        });
      }

      // Calculate class statistics
      const totalStudents = examResults.length;
      const presentStudents = examResults.filter(r => !r.isAbsent).length;
      const absentStudents = examResults.filter(r => r.isAbsent).length;
      const passedStudents = examResults.filter(r => r.status === 'pass').length;
      const failedStudents = examResults.filter(r => r.status === 'fail').length;

      const presentResults = examResults.filter(r => !r.isAbsent);
      const averageMarks = presentResults.length > 0
        ? presentResults.reduce((sum, r) => sum + Number(r.marksObtained), 0) / presentResults.length
        : 0;
      const averagePercentage = presentResults.length > 0
        ? presentResults.reduce((sum, r) => sum + Number(r.percentage), 0) / presentResults.length
        : 0;

      // Grade distribution
      const gradeDistribution: any = {};
      presentResults.forEach(result => {
        gradeDistribution[result.grade] = (gradeDistribution[result.grade] || 0) + 1;
      });

      res.json({
        class: {
          id: classData.id,
          name: classData.name,
          gradeLevel: classData.gradeLevel,
          section: classData.section
        },
        statistics: {
          totalStudents,
          presentStudents,
          absentStudents,
          passedStudents,
          failedStudents,
          passRate: presentStudents > 0 ? (passedStudents / presentStudents) * 100 : 0,
          averageMarks: Math.round(averageMarks * 100) / 100,
          averagePercentage: Math.round(averagePercentage * 100) / 100
        },
        gradeDistribution
      });
    } catch (error) {
      console.error('Error generating class performance report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Attendance report
  static async getAttendanceReport(req: Request, res: Response) {
    try {
      const { classId, dateFrom, dateTo, studentId } = req.query;

      const whereClause: any = {};

      if (classId) {
        whereClause.currentClass = classId;
      }

      if (dateFrom || dateTo) {
        whereClause.date = {};
        if (dateFrom) whereClause.date[Op.gte] = dateFrom;
        if (dateTo) whereClause.date[Op.lte] = dateTo;
      }

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const attendanceRecords = await Attendance.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentId', 'currentClass']
          }
        ],
        order: [['date', 'DESC']]
      });

      // Calculate attendance statistics
      const totalRecords = attendanceRecords.length;
      const presentRecords = attendanceRecords.filter(r => r.status === 'present').length;
      const absentRecords = attendanceRecords.filter(r => r.status === 'absent').length;
      const lateRecords = attendanceRecords.filter(r => r.status === 'late').length;

      const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

      // Daily attendance summary
      const dailySummary: any = {};
      attendanceRecords.forEach(record => {
        const date = record.date.toISOString().split('T')[0];
        if (!dailySummary[date]) {
          dailySummary[date] = {
            total: 0,
            present: 0,
            absent: 0,
            late: 0
          };
        }

        dailySummary[date].total++;
        if (record.status === 'present') dailySummary[date].present++;
        else if (record.status === 'absent') dailySummary[date].absent++;
        else if (record.status === 'late') dailySummary[date].late++;
      });

      res.json({
        summary: {
          totalRecords,
          presentRecords,
          absentRecords,
          lateRecords,
          attendanceRate: Math.round(attendanceRate * 100) / 100
        },
        dailySummary,
        records: attendanceRecords
      });
    } catch (error) {
      console.error('Error generating attendance report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Financial report
  static async getFinancialReport(req: Request, res: Response) {
    try {
      const { dateFrom, dateTo, feeType } = req.query;

      const whereClause: any = {};

      if (dateFrom || dateTo) {
        whereClause.paymentDate = {};
        if (dateFrom) whereClause.paymentDate[Op.gte] = dateFrom;
        if (dateTo) whereClause.paymentDate[Op.lte] = dateTo;
      }

      if (feeType) {
        whereClause.feeType = feeType;
      }

      const payments = await FeePayment.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentId', 'currentClass']
          },
          {
            model: Fee,
            as: 'fee',
            attributes: ['id', 'name', 'amount']
          }
        ],
        order: [['paymentDate', 'DESC']]
      });

      // Calculate financial statistics
      const totalCollection = payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
      const totalPayments = payments.length;
      const pendingPayments = 0; // Status field missing in model
      const completedPayments = payments.length; // Assuming all payments are completed

      // Fee type breakdown
      const feeTypeBreakdown: any = {};
      payments.forEach(payment => {
        const feeType = payment.fee?.name || 'Unknown'; // Using name as feeType
        if (!feeTypeBreakdown[feeType]) {
          feeTypeBreakdown[feeType] = {
            totalAmount: 0,
            count: 0
          };
        }
        feeTypeBreakdown[feeType].totalAmount += Number(payment.amountPaid);
        feeTypeBreakdown[feeType].count++;
      });

      // Monthly collection
      const monthlyCollection: any = {};
      payments.forEach(payment => {
        const month = payment.paymentDate.toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyCollection[month]) {
          monthlyCollection[month] = 0;
        }
        monthlyCollection[month] += Number(payment.amountPaid);
      });

      res.json({
        summary: {
          totalCollection,
          totalPayments,
          pendingPayments,
          completedPayments,
          averagePayment: totalPayments > 0 ? totalCollection / totalPayments : 0
        },
        feeTypeBreakdown,
        monthlyCollection,
        payments
      });
    } catch (error) {
      console.error('Error generating financial report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}