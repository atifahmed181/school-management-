import React, { useState, useEffect } from 'react';
import { reportAPI, classAPI, studentAPI } from '../../services/api';
import { 
  StudentReport, 
  AttendanceReport, 
  AcademicReport, 
  FinancialReport,
  Class,
  Student 
} from '../../types';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [reportData, setReportData] = useState<any>(null);

  // Filter states
  const [filters, setFilters] = useState({
    classId: '',
    studentId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const [classesRes, studentsRes] = await Promise.all([
        classAPI.getAll(),
        studentAPI.getAll(),
      ]);
      setClasses(classesRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      let response;

      switch (activeTab) {
        case 'students':
          response = await reportAPI.getStudents(filters);
          break;
        case 'attendance':
          response = await reportAPI.getAttendance(filters);
          break;
        case 'academic':
          response = await reportAPI.getAcademic(filters);
          break;
        case 'financial':
          response = await reportAPI.getFinancial(filters);
          break;
        default:
          return;
      }

      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implementation for exporting report to PDF/Excel
    console.log('Exporting report...');
  };

  const tabs = [
    { id: 'students', label: 'Student Reports', icon: '👨‍🎓' },
    { id: 'attendance', label: 'Attendance Reports', icon: '📝' },
    { id: 'academic', label: 'Academic Reports', icon: '📚' },
    { id: 'financial', label: 'Financial Reports', icon: '💰' },
  ];

  const renderStudentReport = () => {
    if (!reportData) return null;

    const columns = [
      { key: 'student.firstName', header: 'First Name' },
      { key: 'student.lastName', header: 'Last Name' },
      { key: 'student.studentId', header: 'Student ID' },
      { key: 'student.currentClass', header: 'Class' },
      { 
        key: 'attendance.percentage', 
        header: 'Attendance %',
        render: (item: StudentReport) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            item.attendance.percentage >= 90 ? 'bg-green-100 text-green-800' :
            item.attendance.percentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {item.attendance.percentage}%
          </span>
        )
      },
      { 
        key: 'academic.averageGrade', 
        header: 'Average Grade',
        render: (item: StudentReport) => (
          <span className="font-medium">{item.academic.averageGrade.toFixed(2)}</span>
        )
      },
      { 
        key: 'financial.outstanding', 
        header: 'Outstanding Fees',
        render: (item: StudentReport) => (
          <span className={`font-medium ${
            item.financial.outstanding > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            ${item.financial.outstanding}
          </span>
        )
      },
    ];

    return (
      <Table
        data={reportData}
        columns={columns}
        loading={loading}
        emptyMessage="No student data found"
      />
    );
  };

  const renderAttendanceReport = () => {
    if (!reportData) return null;

    const columns = [
      { key: 'date', header: 'Date' },
      { key: 'summary.totalDays', header: 'Total Days' },
      { key: 'summary.presentDays', header: 'Present' },
      { key: 'summary.absentDays', header: 'Absent' },
      { 
        key: 'summary.attendanceRate', 
        header: 'Attendance Rate',
        render: (item: AttendanceReport) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            item.summary.attendanceRate >= 90 ? 'bg-green-100 text-green-800' :
            item.summary.attendanceRate >= 75 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {item.summary.attendanceRate}%
          </span>
        )
      },
    ];

    return (
      <div>
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{reportData.summary?.totalDays || 0}</p>
              <p className="text-sm text-gray-600">Total Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{reportData.summary?.presentDays || 0}</p>
              <p className="text-sm text-gray-600">Present Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{reportData.summary?.absentDays || 0}</p>
              <p className="text-sm text-gray-600">Absent Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{reportData.summary?.attendanceRate || 0}%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
          </div>
        </div>

        <Table
          data={reportData.details || []}
          columns={columns}
          loading={loading}
          emptyMessage="No attendance data found"
        />
      </div>
    );
  };

  const renderAcademicReport = () => {
    if (!reportData) return null;

    const columns = [
      { key: 'examId', header: 'Exam ID' },
      { key: 'studentId', header: 'Student ID' },
      { key: 'obtainedMarks', header: 'Obtained Marks' },
      { key: 'grade', header: 'Grade' },
      { key: 'remarks', header: 'Remarks' },
    ];

    return (
      <div>
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{reportData.summary?.totalExams || 0}</p>
              <p className="text-sm text-gray-600">Total Exams</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{reportData.summary?.averageGrade || 0}</p>
              <p className="text-sm text-gray-600">Average Grade</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{reportData.summary?.highestGrade || '-'}</p>
              <p className="text-sm text-gray-600">Highest Grade</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{reportData.summary?.lowestGrade || '-'}</p>
              <p className="text-sm text-gray-600">Lowest Grade</p>
            </div>
          </div>
        </div>

        <Table
          data={reportData.results || []}
          columns={columns}
          loading={loading}
          emptyMessage="No academic data found"
        />
      </div>
    );
  };

  const renderFinancialReport = () => {
    if (!reportData) return null;

    const columns = [
      { key: 'feeId', header: 'Fee ID' },
      { key: 'studentId', header: 'Student ID' },
      { key: 'amount', header: 'Amount' },
      { key: 'paymentDate', header: 'Payment Date' },
      { key: 'paymentMethod', header: 'Payment Method' },
      { key: 'receiptNumber', header: 'Receipt Number' },
    ];

    return (
      <div>
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${reportData.summary?.totalFees || 0}</p>
              <p className="text-sm text-gray-600">Total Fees</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${reportData.summary?.collectedFees || 0}</p>
              <p className="text-sm text-gray-600">Collected Fees</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">${reportData.summary?.outstandingFees || 0}</p>
              <p className="text-sm text-gray-600">Outstanding Fees</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{reportData.summary?.collectionRate || 0}%</p>
              <p className="text-sm text-gray-600">Collection Rate</p>
            </div>
          </div>
        </div>

        <Table
          data={reportData.payments || []}
          columns={columns}
          loading={loading}
          emptyMessage="No financial data found"
        />
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeTab) {
      case 'students':
        return renderStudentReport();
      case 'attendance':
        return renderAttendanceReport();
      case 'academic':
        return renderAcademicReport();
      case 'financial':
        return renderFinancialReport();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Generate and view comprehensive reports for your school.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Class"
            options={classes.map(c => ({ value: c.id, label: c.name }))}
            value={filters.classId}
            onChange={(value) => setFilters({ ...filters, classId: value })}
            placeholder="All Classes"
          />

          <Select
            label="Student"
            options={students.map(s => ({ 
              value: s.id, 
              label: `${s.firstName} ${s.lastName}` 
            }))}
            value={filters.studentId}
            onChange={(value) => setFilters({ ...filters, studentId: value })}
            placeholder="All Students"
          />

          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(value) => setFilters({ ...filters, startDate: value })}
          />

          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(value) => setFilters({ ...filters, endDate: value })}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => setFilters({
              classId: '',
              studentId: '',
              startDate: '',
              endDate: '',
            })}
          >
            Clear Filters
          </Button>
          <Button
            variant="primary"
            onClick={generateReport}
            loading={loading}
          >
            Generate Report
          </Button>
          {reportData && (
            <Button
              variant="success"
              onClick={exportReport}
            >
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h3>
        </div>
        <div className="p-6">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 