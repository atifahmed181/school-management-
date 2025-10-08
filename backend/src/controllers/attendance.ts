import { Request, Response } from 'express';
import { Attendance, Student, Staff, Class } from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

export class AttendanceController {
  // Mark attendance for students
  static async markStudentAttendance(req: Request, res: Response) {
    try {
      const { classId, date, attendanceData } = req.body;
      
      if (!classId || !date || !attendanceData || !Array.isArray(attendanceData)) {
        return res.status(400).json({ error: 'Invalid request data' });
      }

      // Check if attendance already exists for this class and date
      const existingAttendance = await Attendance.findOne({
        where: { classId, date }
      });

      if (existingAttendance) {
        return res.status(400).json({ error: 'Attendance already marked for this class and date' });
      }

      const attendanceRecords = attendanceData.map((record: any) => ({
        date,
        classId,
        studentId: record.studentId,
        status: record.status,
        remarks: record.remarks,
        markedBy: req.user?.name || 'System'
      }));

      await Attendance.bulkCreate(attendanceRecords as any);
      
      res.status(201).json({
        message: 'Attendance marked successfully',
        count: attendanceRecords.length
      });
    } catch (error) {
      console.error('Error marking student attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Mark attendance for staff
  static async markStaffAttendance(req: Request, res: Response) {
    try {
      const { date, attendanceData } = req.body;
      
      if (!date || !attendanceData || !Array.isArray(attendanceData)) {
        return res.status(400).json({ error: 'Invalid request data' });
      }

      const attendanceRecords = attendanceData.map((record: any) => ({
        date,
        staffId: record.staffId,
        status: record.status,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        remarks: record.remarks,
        markedBy: req.user?.name || 'System'
      }));

      await Attendance.bulkCreate(attendanceRecords as any);
      
      res.status(201).json({
        message: 'Staff attendance marked successfully',
        count: attendanceRecords.length
      });
    } catch (error) {
      console.error('Error marking staff attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get attendance by class and date
  static async getClassAttendance(req: Request, res: Response) {
    try {
      const { classId, date } = req.params;
      
      const attendance = await Attendance.findAll({
        where: { classId, date },
        include: [
          {
            model: Student,
            attributes: ['id', 'firstName', 'lastName', 'studentId']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      res.json({ attendance });
    } catch (error) {
      console.error('Error fetching class attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get attendance by date range
  static async getAttendanceByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate, classId, studentId, staffId } = req.query;
      
      const whereClause: any = {
        date: {
          [Op.between]: [startDate, endDate]
        }
      };

      if (classId) whereClause.classId = classId;
      if (studentId) whereClause.studentId = studentId;
      if (staffId) whereClause.staffId = staffId;

      const attendance = await Attendance.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            attributes: ['id', 'firstName', 'lastName', 'studentId']
          },
          {
            model: Staff,
            attributes: ['id', 'firstName', 'lastName', 'employeeId']
          },
          {
            model: Class,
            attributes: ['id', 'name', 'gradeLevel', 'section']
          }
        ],
        order: [['date', 'DESC'], ['createdAt', 'ASC']]
      });

      res.json({ attendance });
    } catch (error) {
      console.error('Error fetching attendance by date range:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get attendance statistics
  static async getAttendanceStats(req: Request, res: Response) {
    try {
      const { classId, startDate, endDate } = req.query;
      
      const whereClause: any = {};
      if (classId) whereClause.classId = classId;
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const totalRecords = await Attendance.count({ where: whereClause });
      const presentCount = await Attendance.count({ 
        where: { ...whereClause, status: 'present' } 
      });
      const absentCount = await Attendance.count({ 
        where: { ...whereClause, status: 'absent' } 
      });
      const lateCount = await Attendance.count({ 
        where: { ...whereClause, status: 'late' } 
      });

      const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

      res.json({
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100
      });
    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update attendance record
  static async updateAttendance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const attendance = await Attendance.findByPk(id);
      if (!attendance) {
        return res.status(404).json({ error: 'Attendance record not found' });
      }

      await attendance.update(updateData);
      
      res.json({
        message: 'Attendance updated successfully',
        attendance
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete attendance record
  static async deleteAttendance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const attendance = await Attendance.findByPk(id);
      if (!attendance) {
        return res.status(404).json({ error: 'Attendance record not found' });
      }

      await attendance.destroy();
      
      res.json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
      console.error('Error deleting attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get today's attendance summary
  static async getTodayAttendance(req: Request, res: Response) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const studentAttendance = await Attendance.findAll({
        where: {
          date: today,
          [Op.and]: [Sequelize.literal('"student_id" IS NOT NULL')]
        },
        include: [
          {
            model: Student,
            attributes: ['id', 'firstName', 'lastName', 'studentId']
          },
          {
            model: Class,
            attributes: ['id', 'name', 'gradeLevel', 'section']
          }
        ]
      });

      const staffAttendance = await Attendance.findAll({
        where: {
          date: today,
          [Op.and]: [Sequelize.literal('"staff_id" IS NOT NULL')]
        },
        include: [
          {
            model: Staff,
            attributes: ['id', 'firstName', 'lastName', 'employeeId', 'position']
          }
        ]
      });

      res.json({
        date: today,
        studentAttendance,
        staffAttendance
      });
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get student attendance history
  static async getStudentAttendanceHistory(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;

      const whereClause: any = { studentId };
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const attendance = await Attendance.findAll({
        where: whereClause,
        include: [
          {
            model: Class,
            attributes: ['id', 'name', 'gradeLevel', 'section']
          }
        ],
        order: [['date', 'DESC']]
      });

      const totalDays = attendance.length;
      const presentDays = attendance.filter(a => a.status === 'present').length;
      const absentDays = attendance.filter(a => a.status === 'absent').length;
      const lateDays = attendance.filter(a => a.status === 'late').length;
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      res.json({
        attendance,
        summary: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          percentage: Math.round(percentage * 100) / 100
        }
      });
    } catch (error) {
      console.error('Error fetching student attendance history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get staff attendance history
  static async getStaffAttendanceHistory(req: Request, res: Response) {
    try {
      const { staffId } = req.params;
      const { startDate, endDate } = req.query;

      const whereClause: any = { staffId };
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const attendance = await Attendance.findAll({
        where: whereClause,
        order: [['date', 'DESC']]
      });

      const totalDays = attendance.length;
      const presentDays = attendance.filter(a => a.status === 'present').length;
      const absentDays = attendance.filter(a => a.status === 'absent').length;
      const lateDays = attendance.filter(a => a.status === 'late').length;
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      res.json({
        attendance,
        summary: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          percentage: Math.round(percentage * 100) / 100
        }
      });
    } catch (error) {
      console.error('Error fetching staff attendance history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get students for class with attendance status
  static async getStudentsWithAttendanceStatus(req: Request, res: Response) {
    try {
      const { classId, date } = req.query;

      if (!classId || !date) {
        return res.status(400).json({ error: 'Class ID and date are required' });
      }

      // Get all students in the class
      const students = await Student.findAll({
        where: { presentClass: classId }
      });

      // Get attendance records for this class and date
      const attendanceRecords = await Attendance.findAll({
        where: { classId, date }
      });

      // Map students with their attendance status
      const studentsWithStatus = students.map(student => {
        const record = attendanceRecords.find(a => a.studentId === student.id);
        return {
          id: student.id,
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          rollNumber: student.rollNumber,
          attendanceStatus: record ? record.status : null,
          attendanceId: record ? record.id : null,
          remarks: record ? record.remarks : null
        };
      });

      res.json({ students: studentsWithStatus });
    } catch (error) {
      console.error('Error fetching students with attendance status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all staff with attendance status for a date
  static async getStaffWithAttendanceStatus(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      // Get all staff
      const staff = await Staff.findAll();

      // Get attendance records for this date
      const attendanceRecords = await Attendance.findAll({
        where: { date, [Op.and]: [Sequelize.literal('"staff_id" IS NOT NULL')] }
      });

      // Map staff with their attendance status
      const staffWithStatus = staff.map(member => {
        const record = attendanceRecords.find(a => a.staffId === member.id);
        return {
          id: member.id,
          employeeId: member.employeeId,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          position: member.position,
          department: member.department,
          attendanceStatus: record ? record.status : null,
          attendanceId: record ? record.id : null,
          checkInTime: record ? record.checkInTime : null,
          checkOutTime: record ? record.checkOutTime : null,
          remarks: record ? record.remarks : null
        };
      });

      res.json({ staff: staffWithStatus });
    } catch (error) {
      console.error('Error fetching staff with attendance status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get attendance summary dashboard
  static async getAttendanceDashboard(req: Request, res: Response) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Student statistics
      const totalStudents = await Student.count();
      const studentAttendanceToday = await Attendance.count({
        where: { 
          date: today,
          [Op.and]: [Sequelize.literal('"student_id" IS NOT NULL')]
        }
      });
      const studentsPresentToday = await Attendance.count({
        where: { 
          date: today,
          status: 'present',
          [Op.and]: [Sequelize.literal('"student_id" IS NOT NULL')]
        }
      });
      const studentsAbsentToday = await Attendance.count({
        where: { 
          date: today,
          status: 'absent',
          [Op.and]: [Sequelize.literal('"student_id" IS NOT NULL')]
        }
      });
      const studentsLateToday = await Attendance.count({
        where: { 
          date: today,
          status: 'late',
          [Op.and]: [Sequelize.literal('"student_id" IS NOT NULL')]
        }
      });

      // Staff statistics
      const totalStaff = await Staff.count();
      const staffAttendanceToday = await Attendance.count({
        where: { 
          date: today,
          [Op.and]: [Sequelize.literal('"staff_id" IS NOT NULL')]
        }
      });
      const staffPresentToday = await Attendance.count({
        where: { 
          date: today,
          status: 'present',
          [Op.and]: [Sequelize.literal('"staff_id" IS NOT NULL')]
        }
      });
      const staffAbsentToday = await Attendance.count({
        where: { 
          date: today,
          status: 'absent',
          [Op.and]: [Sequelize.literal('"staff_id" IS NOT NULL')]
        }
      });

      res.json({
        date: today,
        students: {
          total: totalStudents,
          marked: studentAttendanceToday,
          present: studentsPresentToday,
          absent: studentsAbsentToday,
          late: studentsLateToday,
          percentage: studentAttendanceToday > 0 ? 
            Math.round((studentsPresentToday / studentAttendanceToday) * 10000) / 100 : 0
        },
        staff: {
          total: totalStaff,
          marked: staffAttendanceToday,
          present: staffPresentToday,
          absent: staffAbsentToday,
          percentage: staffAttendanceToday > 0 ? 
            Math.round((staffPresentToday / staffAttendanceToday) * 10000) / 100 : 0
        }
      });
    } catch (error) {
      console.error('Error fetching attendance dashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 