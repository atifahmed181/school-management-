import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { dashboardAPI } from '../../services/api';
import { AdminDashboard } from '../../types';
import DashboardStats from '../../components/dashboard/DashboardStats';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Placeholder logo/avatar
const Logo = () => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
    <span className="text-white text-xl font-bold">SM</span>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdmin();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add Student',
      description: 'Register a new student',
      icon: (
        <svg className="w-1 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: () => router.push('/admin/students/new'),
      color: 'bg-blue-500',
    },
    {
      title: 'Add Staff',
      description: 'Register a new staff member',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      onClick: () => router.push('/admin/staff/new'),
      color: 'bg-green-500',
    },
    {
      title: 'Create Exam',
      description: 'Schedule a new exam',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => router.push('/admin/exams'),
      color: 'bg-purple-500',
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: () => router.push('/admin/reports'),
      color: 'bg-yellow-500',
    },
  ];

  // Add avatar/icon rendering for students/staff
  const renderAvatar = (name: string) => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow">
      {name
        .split(' ')
        .map((n) => n[0])
        .join('')}
    </div>
  );

  const recentStudentsColumns = [
    {
      key: 'avatar',
      header: '',
      render: (student: any) => renderAvatar(`${student.firstName} ${student.lastName}`),
    },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'studentId', header: 'Student ID' },
    { key: 'currentClass', header: 'Class' },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (student: any) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => router.push(`/admin/students/${student.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const recentStaffColumns = [
    {
      key: 'avatar',
      header: '',
      render: (staff: any) => renderAvatar(`${staff.firstName} ${staff.lastName}`),
    },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'position', header: 'Position' },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (staff: any) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => router.push(`/admin/staff/${staff.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const upcomingExamsColumns = [
    { key: 'name', header: 'Exam Name' },
    { key: 'examDate', header: 'Date' },
    { key: 'startTime', header: 'Start Time' },
    { key: 'endTime', header: 'End Time' },
    { key: 'totalMarks', header: 'Total Marks' },
    {
      key: 'actions',
      header: 'Actions',
      render: (exam: any) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => router.push(`/admin/exams/${exam.id}/results`)}
        >
          Results
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
        <div className="animate-pulse w-full max-w-5xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen pb-12">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6 bg-white shadow-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Logo />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back! Here's what's happening in your school.</p>
          </div>
        </div>
        {/* Placeholder for user avatar or settings */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">A</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Cards */}
        {dashboardData && (
          <div className="mb-10 mt-8">
            <DashboardStats stats={dashboardData} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-lg p-6 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl ${action.color} bg-opacity-90 text-white flex flex-col items-start gap-3`}
                onClick={action.onClick}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-white bg-opacity-20">
                    <div className="text-white text-2xl">{action.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{action.title}</h3>
                    <p className="text-sm opacity-80">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Students */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Recent Students</h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push('/admin/students')}
              >
                View All
              </Button>
            </div>
            <div className="p-6">
              <Table
                data={dashboardData?.recentStudents || []}
                columns={recentStudentsColumns}
                emptyMessage="No recent students"
              />
            </div>
          </div>

          {/* Recent Staff */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Recent Staff</h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push('/admin/staff')}
              >
                View All
              </Button>
            </div>
            <div className="p-6">
              <Table
                data={dashboardData?.recentStaff || []}
                columns={recentStaffColumns}
                emptyMessage="No recent staff"
              />
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="mt-10">
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Upcoming Exams</h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push('/admin/exams')}
              >
                View All
              </Button>
            </div>
            <div className="p-6">
              <Table
                data={dashboardData?.upcomingExams || []}
                columns={upcomingExamsColumns}
                emptyMessage="No upcoming exams"
              />
            </div>
          </div>
        </div>

        {/* Fee Collection Chart */}
        {dashboardData?.feeCollection && dashboardData.feeCollection.length > 0 && (
          <div className="mt-10">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fee Collection Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.feeCollection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;