import React, { useState, useEffect } from 'react';
import { FaChartBar, FaCalendarAlt, FaDownload, FaUserGraduate, FaChalkboardTeacher, FaSearch } from 'react-icons/fa';
import { attendanceAPI, classAPI, studentAPI, staffAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';

interface AttendanceStats {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
}

interface StudentHistory {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    percentage: number;
  };
}

const AttendanceReports: React.FC = () => {
  const [reportType, setReportType] = useState<'class' | 'student' | 'staff' | 'dateRange'>('class');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadClasses();
    loadStudents();
    loadStaff();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll();
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaffList(response.data.staff || []);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let params: any = { startDate, endDate };

      if (reportType === 'class' && selectedClass) {
        params.classId = selectedClass;
      } else if (reportType === 'student' && selectedStudent) {
        params.studentId = selectedStudent;
      } else if (reportType === 'staff' && selectedStaff) {
        params.staffId = selectedStaff;
      }

      const [statsResponse, recordsResponse] = await Promise.all([
        attendanceAPI.getAttendanceStats(params),
        attendanceAPI.getAttendanceByDateRange(params)
      ]);

      setStats(statsResponse.data);
      setAttendanceRecords(recordsResponse.data.attendance || []);
      showNotification('Report generated successfully', 'success');
    } catch (error: any) {
      showNotification('Failed to generate report', 'error');
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { class: 'bg-success', label: 'Present' },
      absent: { class: 'bg-danger', label: 'Absent' },
      late: { class: 'bg-warning', label: 'Late' },
      excused: { class: 'bg-info', label: 'Excused' },
      half_day: { class: 'bg-warning', label: 'Half Day' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.absent;
    
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const exportToCSV = () => {
    if (attendanceRecords.length === 0) {
      showNotification('No data to export', 'warning');
      return;
    }

    const headers = ['Date', 'Name', 'ID', 'Status', 'Remarks'];
    const rows = attendanceRecords.map(record => [
      record.date,
      record.student ? `${record.student.firstName} ${record.student.lastName}` : 
      record.staff ? `${record.staff.firstName} ${record.staff.lastName}` : 'N/A',
      record.student?.studentId || record.staff?.employeeId || 'N/A',
      record.status,
      record.remarks || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Report exported successfully', 'success');
  };

  return (
    <div className="attendance-reports">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaChartBar className="me-2" />
            Attendance Reports & Analytics
          </h2>
          <p className="text-muted mb-0">Generate detailed attendance reports and insights</p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Report Configuration</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Report Type</label>
              <select 
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
              >
                <option value="class">Class Report</option>
                <option value="student">Student Report</option>
                <option value="staff">Staff Report</option>
                <option value="dateRange">Date Range Report</option>
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {reportType === 'class' && (
              <div className="col-md-3 mb-3">
                <label className="form-label">Select Class</label>
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

            {reportType === 'student' && (
              <div className="col-md-3 mb-3">
                <label className="form-label">Select Student</label>
                <select 
                  className="form-select"
                  value={selectedStudent || ''}
                  onChange={(e) => setSelectedStudent(Number(e.target.value))}
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {reportType === 'staff' && (
              <div className="col-md-3 mb-3">
                <label className="form-label">Select Staff</label>
                <select 
                  className="form-select"
                  value={selectedStaff || ''}
                  onChange={(e) => setSelectedStaff(Number(e.target.value))}
                >
                  <option value="">Select Staff</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName} ({staff.employeeId})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary"
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FaSearch className="me-2" />
                  Generate Report
                </>
              )}
            </button>
            <button 
              className="btn btn-success"
              onClick={exportToCSV}
              disabled={!stats || attendanceRecords.length === 0}
            >
              <FaDownload className="me-2" />
              Export to CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <>
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="stat-card bg-primary">
                <div className="stat-icon">📊</div>
                <div className="stat-details">
                  <div className="stat-value">{stats.totalRecords}</div>
                  <div className="stat-label">Total Records</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-success">
                <div className="stat-icon">✅</div>
                <div className="stat-details">
                  <div className="stat-value">{stats.presentCount}</div>
                  <div className="stat-label">Present</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-danger">
                <div className="stat-icon">❌</div>
                <div className="stat-details">
                  <div className="stat-value">{stats.absentCount}</div>
                  <div className="stat-label">Absent</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-warning">
                <div className="stat-icon">⏰</div>
                <div className="stat-details">
                  <div className="stat-value">{stats.attendancePercentage}%</div>
                  <div className="stat-label">Attendance Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Records Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Attendance Records ({attendanceRecords.length})</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>ID</th>
                      {reportType === 'class' || reportType === 'student' ? (
                        <th>Class</th>
                      ) : (
                        <th>Department</th>
                      )}
                      <th>Status</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted">
                          No records found for the selected criteria
                        </td>
                      </tr>
                    ) : (
                      attendanceRecords.map((record, index) => (
                        <tr key={index}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td className="fw-bold">
                            {record.student && `${record.student.firstName} ${record.student.lastName}`}
                            {record.staff && `${record.staff.firstName} ${record.staff.lastName}`}
                          </td>
                          <td>
                            {record.student && record.student.studentId}
                            {record.staff && record.staff.employeeId}
                          </td>
                          <td>
                            {record.class && `${record.class.name} - ${record.class.section}`}
                            {record.staff && (record.staff.department || '-')}
                          </td>
                          <td>{getStatusBadge(record.status)}</td>
                          <td>{record.checkInTime || '-'}</td>
                          <td>{record.checkOutTime || '-'}</td>
                          <td className="text-muted">{record.remarks || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!stats && !loading && (
        <div className="card">
          <div className="card-body text-center py-5">
            <FaChartBar size={64} className="text-muted mb-3" />
            <h4 className="text-muted">No Report Generated</h4>
            <p className="text-muted">
              Select your report criteria and click "Generate Report" to view attendance analytics
            </p>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
};

export default AttendanceReports;

