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
} 