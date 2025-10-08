import React, { useState, useEffect } from 'react';
import { FaUserCheck, FaCalendarAlt, FaSearch, FaDownload, FaUserGraduate, FaChalkboardTeacher, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { attendanceAPI, classAPI, studentAPI, staffAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';

interface AttendanceDashboard {
  date: string;
  students: {
    total: number;
    marked: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  staff: {
    total: number;
    marked: number;
    present: number;
    absent: number;
    percentage: number;
  };
}

interface StudentWithStatus {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  attendanceStatus: string | null;
  attendanceId: number | null;
  remarks: string | null;
}

interface StaffWithStatus {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  attendanceStatus: string | null;
  attendanceId: number | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  remarks: string | null;
}

const AttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'staff'>('students');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [studentsWithStatus, setStudentsWithStatus] = useState<StudentWithStatus[]>([]);
  const [staffWithStatus, setStaffWithStatus] = useState<StaffWithStatus[]>([]);
  const [dashboard, setDashboard] = useState<AttendanceDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { showNotification } = useNotification();

  // Load dashboard data
  useEffect(() => {
    loadDashboard();
  }, []);

  // Load classes
  useEffect(() => {
    loadClasses();
  }, []);

  // Load students when class or date changes
  useEffect(() => {
    if (activeTab === 'students' && selectedClass && selectedDate) {
      loadStudentsWithStatus();
    }
  }, [activeTab, selectedClass, selectedDate]);

  // Load staff when date changes
  useEffect(() => {
    if (activeTab === 'staff' && selectedDate) {
      loadStaffWithStatus();
    }
  }, [activeTab, selectedDate]);

  const loadDashboard = async () => {
    try {
      const response = await attendanceAPI.getDashboard();
      setDashboard(response.data);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll();
      setClasses(response.data.classes || []);
    } catch (error: any) {
      console.error('Error loading classes:', error);
    }
  };

  const loadStudentsWithStatus = async () => {
    if (!selectedClass || !selectedDate) return;
    
    setLoading(true);
    try {
      const response = await attendanceAPI.getStudentsWithStatus(selectedClass, selectedDate);
      setStudentsWithStatus(response.data.students || []);
    } catch (error: any) {
      showNotification('Failed to load students', 'error');
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStaffWithStatus = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const response = await attendanceAPI.getStaffWithStatus(selectedDate);
      setStaffWithStatus(response.data.staff || []);
    } catch (error: any) {
      showNotification('Failed to load staff', 'error');
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkStudentAttendance = async (studentId: number, status: string) => {
    try {
      const student = studentsWithStatus.find(s => s.id === studentId);
      
      if (student?.attendanceId) {
        // Update existing attendance
        await attendanceAPI.update(student.attendanceId, { status });
        showNotification('Attendance updated successfully', 'success');
      } else {
        // Mark new attendance
        await attendanceAPI.markStudentAttendance({
          classId: selectedClass,
          date: selectedDate,
          attendanceData: [{
            studentId,
            status,
            remarks: ''
          }]
        });
        showNotification('Attendance marked successfully', 'success');
      }
      
      loadStudentsWithStatus();
      loadDashboard();
    } catch (error: any) {
      showNotification(error.response?.data?.error || 'Failed to mark attendance', 'error');
    }
  };

  const handleMarkStaffAttendance = async (staffId: number, status: string, checkInTime?: string, checkOutTime?: string) => {
    try {
      const staff = staffWithStatus.find(s => s.id === staffId);
      
      if (staff?.attendanceId) {
        // Update existing attendance
        await attendanceAPI.update(staff.attendanceId, { 
          status, 
          checkInTime: checkInTime || null,
          checkOutTime: checkOutTime || null
        });
        showNotification('Attendance updated successfully', 'success');
      } else {
        // Mark new attendance
        await attendanceAPI.markStaffAttendance({
          date: selectedDate,
          attendanceData: [{
            staffId,
            status,
            checkInTime: checkInTime || null,
            checkOutTime: checkOutTime || null,
            remarks: ''
          }]
        });
        showNotification('Attendance marked successfully', 'success');
      }
      
      loadStaffWithStatus();
      loadDashboard();
    } catch (error: any) {
      showNotification(error.response?.data?.error || 'Failed to mark attendance', 'error');
    }
  };

  const handleBulkMarkStudents = async (status: string) => {
    if (!selectedClass || !selectedDate) {
      showNotification('Please select a class and date', 'warning');
      return;
    }

    const unmarkedStudents = studentsWithStatus.filter(s => !s.attendanceStatus);
    
    if (unmarkedStudents.length === 0) {
      showNotification('All students already have attendance marked', 'info');
      return;
    }

    try {
      const attendanceData = unmarkedStudents.map(student => ({
        studentId: student.id,
        status,
        remarks: 'Bulk marked'
      }));

      await attendanceAPI.markStudentAttendance({
        classId: selectedClass,
        date: selectedDate,
        attendanceData
      });

      showNotification(`Marked ${unmarkedStudents.length} students as ${status}`, 'success');
      loadStudentsWithStatus();
      loadDashboard();
    } catch (error: any) {
      showNotification(error.response?.data?.error || 'Failed to mark bulk attendance', 'error');
    }
  };

  const handleBulkMarkStaff = async (status: string) => {
    if (!selectedDate) {
      showNotification('Please select a date', 'warning');
      return;
    }

    const unmarkedStaff = staffWithStatus.filter(s => !s.attendanceStatus);
    
    if (unmarkedStaff.length === 0) {
      showNotification('All staff already have attendance marked', 'info');
      return;
    }

    try {
      const attendanceData = unmarkedStaff.map(staff => ({
        staffId: staff.id,
        status,
        checkInTime: status === 'present' ? '09:00:00' : null,
        checkOutTime: null,
        remarks: 'Bulk marked'
      }));

      await attendanceAPI.markStaffAttendance({
        date: selectedDate,
        attendanceData
      });

      showNotification(`Marked ${unmarkedStaff.length} staff as ${status}`, 'success');
      loadStaffWithStatus();
      loadDashboard();
    } catch (error: any) {
      showNotification(error.response?.data?.error || 'Failed to mark bulk attendance', 'error');
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return <span className="badge bg-secondary">Not Marked</span>;
    }

    const statusConfig = {
      present: { class: 'bg-success', icon: <FaCheckCircle />, label: 'Present' },
      absent: { class: 'bg-danger', icon: <FaTimesCircle />, label: 'Absent' },
      late: { class: 'bg-warning', icon: <FaClock />, label: 'Late' },
      excused: { class: 'bg-info', icon: <FaExclamationCircle />, label: 'Excused' },
      half_day: { class: 'bg-warning', icon: <FaClock />, label: 'Half Day' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.absent;
    
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const filteredStudents = studentsWithStatus.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || student.attendanceStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredStaff = staffWithStatus.filter(staff => {
    const matchesSearch = 
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || staff.attendanceStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="attendance-management">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaUserCheck className="me-2" />
            Attendance Management
          </h2>
          <p className="text-muted mb-0">Mark and manage student and staff attendance</p>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {dashboard && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card bg-primary">
              <div className="stat-icon">
                <FaUserGraduate />
              </div>
              <div className="stat-details">
                <div className="stat-value">{dashboard.students.present}/{dashboard.students.total}</div>
                <div className="stat-label">Students Present Today</div>
                <div className="stat-sub">{dashboard.students.percentage}% Attendance</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-danger">
              <div className="stat-icon">
                <FaTimesCircle />
              </div>
              <div className="stat-details">
                <div className="stat-value">{dashboard.students.absent}</div>
                <div className="stat-label">Students Absent</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-success">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-details">
                <div className="stat-value">{dashboard.staff.present}/{dashboard.staff.total}</div>
                <div className="stat-label">Staff Present Today</div>
                <div className="stat-sub">{dashboard.staff.percentage}% Attendance</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-warning">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-details">
                <div className="stat-value">{dashboard.students.late}</div>
                <div className="stat-label">Late Arrivals</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card mb-4">
        <div className="card-header p-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <FaUserGraduate className="me-2" />
                Student Attendance
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'staff' ? 'active' : ''}`}
                onClick={() => setActiveTab('staff')}
              >
                <FaChalkboardTeacher className="me-2" />
                Staff Attendance
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            {activeTab === 'students' && (
              <div className="col-md-3">
                <label className="form-label">Class</label>
                <select 
                  className="form-select"
                  value={selectedClass || ''}
                  onChange={(e) => setSelectedClass(Number(e.target.value))}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.gradeLevel} ({cls.section})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter Status</label>
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
                <option value="half_day">Half Day</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="mb-3 d-flex gap-2">
            <button 
              className="btn btn-success btn-sm"
              onClick={() => activeTab === 'students' ? handleBulkMarkStudents('present') : handleBulkMarkStaff('present')}
            >
              <FaCheckCircle className="me-1" />
              Mark All Present
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => activeTab === 'students' ? handleBulkMarkStudents('absent') : handleBulkMarkStaff('absent')}
            >
              <FaTimesCircle className="me-1" />
              Mark All Absent
            </button>
            <button className="btn btn-secondary btn-sm ms-auto">
              <FaDownload className="me-1" />
              Export Report
            </button>
          </div>

          {/* Student Attendance Table */}
          {activeTab === 'students' && (
            <>
              {!selectedClass ? (
                <div className="text-center py-5 text-muted">
                  <FaCalendarAlt size={48} className="mb-3" />
                  <p>Please select a class to view student attendance</p>
                </div>
              ) : loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Roll No.</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-muted">
                            No students found
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => (
                          <tr key={student.id}>
                            <td>{student.studentId}</td>
                            <td className="fw-bold">{student.firstName} {student.lastName}</td>
                            <td>{student.rollNumber}</td>
                            <td>{student.email}</td>
                            <td>{getStatusBadge(student.attendanceStatus)}</td>
                            <td className="text-muted">{student.remarks || '-'}</td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button 
                                  className="btn btn-outline-success"
                                  onClick={() => handleMarkStudentAttendance(student.id, 'present')}
                                  title="Present"
                                >
                                  <FaCheckCircle />
                                </button>
                                <button 
                                  className="btn btn-outline-danger"
                                  onClick={() => handleMarkStudentAttendance(student.id, 'absent')}
                                  title="Absent"
                                >
                                  <FaTimesCircle />
                                </button>
                                <button 
                                  className="btn btn-outline-warning"
                                  onClick={() => handleMarkStudentAttendance(student.id, 'late')}
                                  title="Late"
                                >
                                  <FaClock />
                                </button>
                                <button 
                                  className="btn btn-outline-info"
                                  onClick={() => handleMarkStudentAttendance(student.id, 'excused')}
                                  title="Excused"
                                >
                                  <FaExclamationCircle />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Staff Attendance Table */}
          {activeTab === 'staff' && (
            <>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-4 text-muted">
                            No staff found
                          </td>
                        </tr>
                      ) : (
                        filteredStaff.map((staff) => (
                          <tr key={staff.id}>
                            <td>{staff.employeeId}</td>
                            <td className="fw-bold">{staff.firstName} {staff.lastName}</td>
                            <td>{staff.position}</td>
                            <td>{staff.department}</td>
                            <td>{staff.checkInTime || '-'}</td>
                            <td>{staff.checkOutTime || '-'}</td>
                            <td>{getStatusBadge(staff.attendanceStatus)}</td>
                            <td className="text-muted">{staff.remarks || '-'}</td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button 
                                  className="btn btn-outline-success"
                                  onClick={() => handleMarkStaffAttendance(staff.id, 'present', '09:00:00')}
                                  title="Present"
                                >
                                  <FaCheckCircle />
                                </button>
                                <button 
                                  className="btn btn-outline-danger"
                                  onClick={() => handleMarkStaffAttendance(staff.id, 'absent')}
                                  title="Absent"
                                >
                                  <FaTimesCircle />
                                </button>
                                <button 
                                  className="btn btn-outline-warning"
                                  onClick={() => handleMarkStaffAttendance(staff.id, 'late', '09:30:00')}
                                  title="Late"
                                >
                                  <FaClock />
                                </button>
                                <button 
                                  className="btn btn-outline-info"
                                  onClick={() => handleMarkStaffAttendance(staff.id, 'half_day', '09:00:00', '13:00:00')}
                                  title="Half Day"
                                >
                                  <FaExclamationCircle />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .stat-card {
          border-radius: 12px;
          padding: 1.5rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.9;
        }

        .stat-details {
          flex: 1;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .stat-sub {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }

        .bg-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .bg-success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .bg-danger {
          background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
        }

        .bg-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .nav-tabs .nav-link {
          border: none;
          color: #6c757d;
          padding: 1rem 1.5rem;
        }

        .nav-tabs .nav-link.active {
          color: #667eea;
          border-bottom: 3px solid #667eea;
          font-weight: 600;
        }

        .nav-tabs .nav-link:hover {
          border-color: transparent;
          color: #667eea;
        }

        .badge {
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .btn-group-sm .btn {
          padding: 0.25rem 0.5rem;
        }

        .table td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default AttendanceManagement;

