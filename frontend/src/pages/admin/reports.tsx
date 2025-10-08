import React, { useState, useEffect } from 'react';
import { FaChartBar, FaDownload, FaCalendarAlt, FaUserGraduate, FaChalkboardTeacher, FaMoneyBillWave, FaUsers, FaSearch } from 'react-icons/fa';
import { reportAPI, classAPI, studentAPI, staffAPI } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

interface ReportFilters {
  startDate: string;
  endDate: string;
  classId: string;
  studentId: string;
  staffId: string;
  department: string;
  reportType: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface ReportData {
  summary: any;
  records: any[];
  charts: any;
}

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'attendance'>('accounts');
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const { showNotification } = useNotification();

  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    classId: '',
    studentId: '',
    staffId: '',
    department: '',
    reportType: 'overview',
    period: 'monthly'
  });

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      const [classesRes, studentsRes, staffRes] = await Promise.all([
        classAPI.getAll(),
        studentAPI.getAll(),
        staffAPI.getAll()
      ]);
      setClasses(classesRes.data.classes || []);
      setStudents(studentsRes.data.students || []);
      setStaff(staffRes.data.staff || []);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        classId: filters.classId || undefined,
        studentId: filters.studentId || undefined,
        staffId: filters.staffId || undefined,
        department: filters.department || undefined,
        period: filters.period
      };

      if (activeTab === 'accounts') {
        switch (activeSubTab) {
          case 'overview':
            response = await reportAPI.getFinancial(params);
            break;
          case 'fee-collection':
            response = await reportAPI.getFinancial(params);
            break;
          case 'expenses':
            response = await reportAPI.getFinancial(params);
            break;
          case 'profit-loss':
            response = await reportAPI.getFinancial(params);
            break;
          default:
            response = await reportAPI.getFinancial(params);
        }
      } else if (activeTab === 'attendance') {
        switch (activeSubTab) {
          case 'student-overview':
            response = await reportAPI.getAttendance(params);
            break;
          case 'student-wise':
            response = await reportAPI.getAttendance({ ...params, studentId: filters.studentId });
            break;
          case 'class-wise':
            response = await reportAPI.getAttendance({ ...params, classId: filters.classId });
            break;
          case 'employee-overview':
            response = await reportAPI.getAttendance(params);
            break;
          case 'employee-wise':
            response = await reportAPI.getAttendance({ ...params, staffId: filters.staffId });
            break;
          case 'department-wise':
            response = await reportAPI.getAttendance({ ...params, department: filters.department });
            break;
          default:
            response = await reportAPI.getAttendance(params);
        }
      }

      setReportData(response.data);
      showNotification('Report generated successfully', 'success');
    } catch (error: any) {
      showNotification('Failed to generate report', 'error');
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) {
      showNotification('No data to export', 'warning');
      return;
    }

    const headers = ['Date', 'Description', 'Amount', 'Type', 'Status'];
    const rows = reportData.records.map(record => [
      record.date || record.paymentDate || '-',
      record.description || record.feeType || record.studentName || '-',
      record.amount || '-',
      record.type || record.status || '-',
      record.status || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${activeSubTab}-report-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Report exported successfully', 'success');
  };

  const accountsTabs = [
    { id: 'overview', label: 'Financial Overview', icon: <FaChartBar /> },
    { id: 'fee-collection', label: 'Fee Collection', icon: <FaMoneyBillWave /> },
    { id: 'expenses', label: 'Expenses', icon: <FaMoneyBillWave /> },
    { id: 'profit-loss', label: 'Profit & Loss', icon: <FaChartBar /> }
  ];

  const attendanceTabs = [
    { id: 'student-overview', label: 'Student Overview', icon: <FaUserGraduate /> },
    { id: 'student-wise', label: 'Student-wise', icon: <FaUserGraduate /> },
    { id: 'class-wise', label: 'Class & Section-wise', icon: <FaUsers /> },
    { id: 'employee-overview', label: 'Employee Overview', icon: <FaChalkboardTeacher /> },
    { id: 'employee-wise', label: 'Individual Employee', icon: <FaChalkboardTeacher /> },
    { id: 'department-wise', label: 'Department-wise', icon: <FaUsers /> }
  ];

  const renderReportContent = () => {
    if (!reportData) {
      return (
        <div className="text-center py-12">
          <FaChartBar size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select filters and generate a report to view data</p>
        </div>
      );
    }

    if (activeTab === 'accounts') {
      return renderAccountsReport();
    } else {
      return renderAttendanceReport();
    }
  };

  const renderAccountsReport = () => {
    const summary = reportData?.summary || {};
    
    return (
      <div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card bg-primary">
            <div className="stat-icon">💰</div>
            <div className="stat-details">
              <div className="stat-value">${summary.totalCollection || 0}</div>
              <div className="stat-label">Total Collection</div>
            </div>
          </div>
          <div className="stat-card bg-success">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <div className="stat-value">${summary.completedPayments || 0}</div>
              <div className="stat-label">Completed Payments</div>
            </div>
          </div>
          <div className="stat-card bg-warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-details">
              <div className="stat-value">${summary.pendingPayments || 0}</div>
              <div className="stat-label">Pending Payments</div>
            </div>
          </div>
          <div className="stat-card bg-info">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <div className="stat-value">{summary.totalPayments || 0}</div>
              <div className="stat-label">Total Transactions</div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {(reportData?.records || []).map((record, index) => (
                    <tr key={index}>
                      <td>{new Date(record.paymentDate || record.date).toLocaleDateString()}</td>
                      <td>{record.student ? `${record.student.firstName} ${record.student.lastName}` : '-'}</td>
                      <td>{record.fee?.feeType || record.feeType || '-'}</td>
                      <td className="fw-bold">${record.amount}</td>
                      <td>
                        <span className={`badge ${
                          record.status === 'completed' ? 'bg-success' : 
                          record.status === 'pending' ? 'bg-warning' : 'bg-danger'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.paymentMethod || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendanceReport = () => {
    const summary = reportData?.summary || {};
    
    return (
      <div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card bg-primary">
            <div className="stat-icon">📅</div>
            <div className="stat-details">
              <div className="stat-value">{summary.totalRecords || 0}</div>
              <div className="stat-label">Total Records</div>
            </div>
          </div>
          <div className="stat-card bg-success">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <div className="stat-value">{summary.presentRecords || 0}</div>
              <div className="stat-label">Present</div>
            </div>
          </div>
          <div className="stat-card bg-danger">
            <div className="stat-icon">❌</div>
            <div className="stat-details">
              <div className="stat-value">{summary.absentRecords || 0}</div>
              <div className="stat-label">Absent</div>
            </div>
          </div>
          <div className="stat-card bg-warning">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <div className="stat-value">{summary.attendanceRate || 0}%</div>
              <div className="stat-label">Attendance Rate</div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Class/Department</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {(reportData?.records || []).map((record, index) => (
                    <tr key={index}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td className="fw-bold">
                        {record.student ? `${record.student.firstName} ${record.student.lastName}` :
                         record.staff ? `${record.staff.firstName} ${record.staff.lastName}` : '-'}
                      </td>
                      <td>
                        {record.student?.studentId || record.staff?.employeeId || '-'}
                      </td>
                      <td>
                        {record.student?.currentClass || record.staff?.department || '-'}
                      </td>
                      <td>
                        <span className={`badge ${
                          record.status === 'present' ? 'bg-success' :
                          record.status === 'absent' ? 'bg-danger' :
                          record.status === 'late' ? 'bg-warning' : 'bg-info'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.checkInTime || '-'}</td>
                      <td>{record.checkOutTime || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="reports-page">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaChartBar className="me-2" />
            Reports & Analytics
          </h2>
          <p className="text-muted mb-0">Generate comprehensive reports for accounts and attendance</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="card mb-4">
        <div className="card-header p-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'accounts' ? 'active' : ''}`}
                onClick={() => setActiveTab('accounts')}
              >
                <FaMoneyBillWave className="me-2" />
                Accounts Reports
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <FaCalendarAlt className="me-2" />
                Attendance Reports
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {/* Sub Tabs */}
          <div className="mb-4">
            <div className="border-bottom mb-3">
              <nav className="nav nav-pills">
                {(activeTab === 'accounts' ? accountsTabs : attendanceTabs).map((tab) => (
                  <button
                    key={tab.id}
                    className={`nav-link ${activeSubTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveSubTab(tab.id)}
                  >
                    {tab.icon}
                    <span className="ms-1">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-2">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Period</label>
              <select 
                className="form-select"
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value as any })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            {activeTab === 'accounts' && (
              <>
                <div className="col-md-2">
                  <label className="form-label">Class</label>
                  <select 
                    className="form-select"
                    value={filters.classId}
                    onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.gradeLevel}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Student</label>
                  <select 
                    className="form-select"
                    value={filters.studentId}
                    onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                  >
                    <option value="">All Students</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {activeTab === 'attendance' && (
              <>
                {(activeSubTab === 'student-wise' || activeSubTab === 'class-wise') && (
                  <>
                    <div className="col-md-2">
                      <label className="form-label">Class</label>
                      <select 
                        className="form-select"
                        value={filters.classId}
                        onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
                      >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - {cls.gradeLevel}
                          </option>
                        ))}
                      </select>
                    </div>
                    {activeSubTab === 'student-wise' && (
                      <div className="col-md-2">
                        <label className="form-label">Student</label>
                        <select 
                          className="form-select"
                          value={filters.studentId}
                          onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                        >
                          <option value="">All Students</option>
                          {students.map(student => (
                            <option key={student.id} value={student.id}>
                              {student.firstName} {student.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
                
                {(activeSubTab === 'employee-wise' || activeSubTab === 'department-wise') && (
                  <>
                    <div className="col-md-2">
                      <label className="form-label">Department</label>
                      <select 
                        className="form-select"
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                      >
                        <option value="">All Departments</option>
                        <option value="Administration">Administration</option>
                        <option value="Senior Management">Senior Management</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Support Staff">Support Staff</option>
                      </select>
                    </div>
                    {activeSubTab === 'employee-wise' && (
                      <div className="col-md-2">
                        <label className="form-label">Employee</label>
                        <select 
                          className="form-select"
                          value={filters.staffId}
                          onChange={(e) => setFilters({ ...filters, staffId: e.target.value })}
                        >
                          <option value="">All Staff</option>
                          {staff.map(member => (
                            <option key={member.id} value={member.id}>
                              {member.firstName} {member.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            
            <div className="col-md-2 d-flex align-items-end">
              <div className="btn-group w-100">
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
                      Generate
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-success"
                  onClick={exportReport}
                  disabled={!reportData}
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          {renderReportContent()}
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

        .bg-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .bg-success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .bg-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .bg-info {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
        }

        .bg-danger {
          background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
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

        .nav-pills .nav-link {
          border-radius: 0.5rem;
          margin-right: 0.5rem;
          padding: 0.5rem 1rem;
        }

        .nav-pills .nav-link.active {
          background-color: #667eea;
          color: white;
        }

        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.375rem 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default ReportsPage;
