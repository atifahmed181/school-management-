import { Request, Response } from 'express';
import { Student } from '../models/student';
import { Staff } from '../models/staff';
import { Class } from '../models/class';
import { Attendance } from '../models/attendance';
import { Exam, ExamResult } from '../models/exam';
import { Fee } from '../models/fee';
import { FeePayment } from '../models/feePayment';
import { Subject } from '../models/subject';
import { Op } from 'sequelize';
import { sequelize } from '../models';

export class DashboardController {
  // Get admin dashboard data
  static async getAdminDashboard(req: Request, res: Response) {
    try {
      // Get total counts
      const totalStudents = await Student.count();
      const totalStaff = await Staff.count();
      const totalClasses = await Class.count();
      const totalExams = await Exam.count();

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

      const totalAttendance = await Attendance.count({
        where: { date: today }
      });

      const attendanceRate = totalAttendance > 0 ? (todayAttendance / totalAttendance) * 100 : 0;

      // Get recent students (last 5)
      const recentStudents = await Student.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'firstName', 'lastName', 'studentId', 'currentClass', 'status']
      });

      // Get recent staff (last 5)
      const recentStaff = await Staff.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'firstName', 'lastName', 'employeeId', 'position', 'status']
      });

      // Get upcoming exams (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingExams = await Exam.findAll({
        where: {
          examDate: {
            [Op.between]: [new Date(), nextWeek]
          },
          isActive: true
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
        order: [['examDate', 'ASC']],
        limit: 5
      });

      // Get fee collection data for last 6 months
      const feeCollection = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const monthlyCollection = await FeePayment.sum('amountPaid', {
          where: {
            [Op.and]: [
              sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "paymentDate"')), month),
              sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "paymentDate"')), year)
            ]
          }
        });

        feeCollection.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          amount: monthlyCollection || 0
        });
      }

      // Calculate total fees and collected fees
      const totalFees = await Fee.sum('amount', { where: { isActive: true } });
      const collectedFees = await FeePayment.sum('amountPaid');

      res.json({
        totalStudents,
        totalStaff,
        totalClasses,
        totalExams,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        averageGrade: 85.5, // This would need to be calculated from exam results
        totalFees: totalFees || 0,
        collectedFees: collectedFees || 0,
        recentStudents,
        recentStaff,
        upcomingExams,
        feeCollection
      });
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get teacher dashboard data
  static async getTeacherDashboard(req: Request, res: Response) {
    try {
      const teacherId = (req as any).user.id;

      // Get classes taught by the teacher
      const teacherClasses = await Class.findAll({
        where: { teacherId },
        attributes: ['id', 'name', 'gradeLevel', 'section', 'currentEnrollment', 'capacity']
      });

      const classIds = teacherClasses.map(c => c.id);

      // Get total students in teacher's classes
      const totalStudents = teacherClasses.reduce((sum, c) => sum + c.currentEnrollment, 0);

      // Get today's attendance for teacher's classes
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = await Attendance.count({
        where: {
          date: today,
          status: 'present',
          classId: {
            [Op.in]: classIds
          }
        }
      });

      const totalAttendance = await Attendance.count({
        where: {
          date: today,
          classId: {
            [Op.in]: classIds
          }
        }
      });

      const attendanceRate = totalAttendance > 0 ? (todayAttendance / totalAttendance) * 100 : 0;

      // Get upcoming exams for teacher's classes
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingExams = await Exam.findAll({
        where: {
          classId: {
            [Op.in]: classIds
          },
          examDate: {
            [Op.between]: [new Date(), nextWeek]
          },
          isActive: true
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
        order: [['examDate', 'ASC']],
        limit: 5
      });

      // Get attendance summary for last 7 days
      const attendanceSummary = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const present = await Attendance.count({
          where: {
            date: dateStr,
            status: 'present',
            classId: {
              [Op.in]: classIds
            }
          }
        });

        const absent = await Attendance.count({
          where: {
            date: dateStr,
            status: 'absent',
            classId: {
              [Op.in]: classIds
            }
          }
        });

        attendanceSummary.push({
          date: dateStr,
          present,
          absent
        });
      }

      res.json({
        totalStudents,
        totalStaff: 1, // Teacher only
        totalClasses: teacherClasses.length,
        totalExams: upcomingExams.length,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        averageGrade: 85.5, // This would need to be calculated
        totalFees: 0, // Teachers don't manage fees
        collectedFees: 0,
        myClasses: teacherClasses,
        myStudents: [], // This would need to be populated with actual student data
        upcomingExams,
        attendanceSummary
      });
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get student dashboard data
  static async getStudentDashboard(req: Request, res: Response) {
    try {
      const studentId = (req as any).user.id;

      // Get student information
      const student = await Student.findOne({
        where: { userId: studentId }
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Get student's attendance for current month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const monthlyAttendance = await Attendance.findAll({
        where: {
          [Op.and]: [
            { studentId: student.id },
            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date"')), currentMonth),
            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')), currentYear)
          ]
        },
        order: [['date', 'DESC']]
      });

      const totalDays = monthlyAttendance.length;
      const presentDays = monthlyAttendance.filter(a => a.status === 'present').length;
      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      // Get student's recent exam results
      const recentExamResults = await ExamResult.findAll({
        where: { studentId: student.id },
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
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      // Get upcoming exams for student's class
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingExams = await Exam.findAll({
        where: {
          classId: {
            [Op.in]: [student.currentClass]
          },
          examDate: {
            [Op.between]: [new Date(), nextWeek]
          },
          isActive: true
        },
        include: [
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['examDate', 'ASC']],
        limit: 5
      });

      // Get fee payments
      const feePayments = await FeePayment.findAll({
        where: {
          studentId: student.id
        },
        include: [
          {
            model: Fee,
            as: 'fee',
            attributes: ['id', 'name', 'amount']
          }
        ],
        order: [['paymentDate', 'DESC']],
        limit: 5
      });

      // Get current class information
      const currentClass = await Class.findOne({
        where: { name: student.currentClass }
      });

      res.json({
        profile: student,
        currentClass: currentClass || { name: student.currentClass },
        attendance: monthlyAttendance,
        examResults: recentExamResults,
        feePayments,
        upcomingExams
      });
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get parent dashboard data
  static async getParentDashboard(req: Request, res: Response) {
    try {
      const parentId = (req as any).user.id;

      // Get children (students) associated with this parent
      // This assumes there's a relationship between parent and students
      // For now, we'll return a mock response
      const children = await Student.findAll({
        where: { 
          // This would need to be adjusted based on your parent-student relationship
          // For now, we'll get all students as a placeholder
        },
        limit: 5
      });

      // Get attendance for children
      const attendance = await Attendance.findAll({
        where: {
          studentId: {
            [Op.in]: children.map(c => c.id)
          }
        },
        order: [['date', 'DESC']],
        limit: 10
      });

      // Get exam results for children
      const examResults = await ExamResult.findAll({
        where: {
          studentId: {
            [Op.in]: children.map(c => c.id)
          }
        },
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
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Get fee payments for children
      const feePayments = await FeePayment.findAll({
        where: {
          studentId: {
            [Op.in]: children.map(c => c.id)
          }
        },
        include: [
          {
            model: Fee,
            as: 'fee',
            attributes: ['id', 'name', 'amount']
          }
        ],
        order: [['paymentDate', 'DESC']],
        limit: 10
      });

      // Get upcoming exams for children's classes
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingExams = await Exam.findAll({
        where: {
          classId: {
            [Op.in]: children.map(c => c.currentClass)
          },
          examDate: {
            [Op.between]: [new Date(), nextWeek]
          },
          isActive: true
        },
        include: [
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['examDate', 'ASC']],
        limit: 5
      });

      res.json({
        children,
        attendance,
        examResults,
        feePayments,
        upcomingExams
      });
    } catch (error) {
      console.error('Error fetching parent dashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get analytics data
  static async getAnalytics(req: Request, res: Response) {
    try {
      const { period = 'month' } = req.query;

      let startDate: Date;
      const endDate = new Date();

      switch (period) {
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
      }

      // Student growth
      const studentGrowth = await Student.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      // Staff growth
      const staffGrowth = await Staff.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      // Attendance trends
      const attendanceData = await Attendance.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: [
          'date',
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['date', 'status'],
        order: [['date', 'ASC']]
      });

      // Fee collection trends
      const feeCollectionData = await FeePayment.findAll({
        where: {
          paymentDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: [
          'paymentDate',
          [sequelize.fn('SUM', sequelize.col('amountPaid')), 'totalAmount']
        ],
        group: ['paymentDate'],
        order: [['paymentDate', 'ASC']]
      });

      res.json({
        period,
        growth: {
          students: studentGrowth,
          staff: staffGrowth
        },
        attendance: attendanceData,
        feeCollection: feeCollectionData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 