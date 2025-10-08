import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change: string;
  positive: boolean;
}

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const router = useRouter();
  
  // Mock data for charts
  const attendanceData = [
    { name: 'Mon', attendance: 85 },
    { name: 'Tue', attendance: 92 },
    { name: 'Wed', attendance: 78 },
    { name: 'Thu', attendance: 88 },
    { name: 'Fri', attendance: 90 },
    { name: 'Sat', attendance: 75 },
  ];

  const feeCollectionData = [
    { name: 'Jan', collected: 4000, expected: 5000 },
    { name: 'Feb', collected: 3000, expected: 4500 },
    { name: 'Mar', collected: 2000, expected: 3000 },
    { name: 'Apr', collected: 2780, expected: 4000 },
    { name: 'May', collected: 1890, expected: 3500 },
    { name: 'Jun', collected: 2390, expected: 4000 },
  ];

  const studentDistribution = [
    { name: 'Active', value: 75 },
    { name: 'Inactive', value: 25 },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  // Mock stats
  const stats: StatCard[] = [
    { title: 'Total Students', value: '1,242', icon: '👨‍🎓', color: 'primary', change: '+5.3%', positive: true },
    { title: 'Total Teachers', value: '86', icon: '👨‍🏫', color: 'success', change: '+1.2%', positive: true },
    { title: 'Active Courses', value: '42', icon: '📚', color: 'warning', change: '-0.5%', positive: false },
    { title: 'Pending Fees', value: '$24,500', icon: '💰', color: 'danger', change: '+2.1%', positive: false },
  ];

  return (
    <div className="container-fluid py-3">
      <div className="row mb-4">
        <div className="col">
          <h2>Dashboard</h2>
          <p className="text-muted">Welcome back! Here's what's happening with your school today.</p>
        </div>
        <div className="col d-flex justify-content-end">
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn btn-outline-primary ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              type="button" 
              className={`btn btn-outline-primary ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              type="button" 
              className={`btn btn-outline-primary ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div className="col-xs-12 col-sm-6 col-lg-3 mb-3" key={index}>
            <div className="card h-100 border-start border-primary border-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">{stat.title}</h6>
                    <h4 className="mb-0">{stat.value}</h4>
                    <div className="d-flex align-items-center mt-2">
                      <span className={`me-1 ${stat.positive ? 'text-success' : 'text-danger'}`}>
                        {stat.positive ? '↗️' : '↘️'}
                      </span>
                      <small className={stat.positive ? 'text-success' : 'text-danger'}>
                        {stat.change}
                      </small>
                    </div>
                  </div>
                  <div className={`text-${stat.color} fs-1`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        {/* Attendance Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <span className="me-2">📊</span>
                Weekly Attendance
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Student Distribution */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <span className="me-2">👨‍🎓</span>
                Student Status
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={studentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {studentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Collection Chart */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <span className="me-2">💰</span>
                Fee Collection vs Expected
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={feeCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="collected" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="expected" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="row">
        {/* Quick Actions */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => router.push('/students')}
                  >
                    <span className="me-2">👨‍🎓</span>
                    Add Student
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={() => router.push('/teachers')}
                  >
                    <span className="me-2">👨‍🏫</span>
                    Add Teacher
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    className="btn btn-outline-warning w-100"
                    onClick={() => router.push('/attendance')}
                  >
                    <span className="me-2">📅</span>
                    Mark Attendance
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    className="btn btn-outline-info w-100"
                    onClick={() => router.push('/fees')}
                  >
                    <span className="me-2">💰</span>
                    Collect Fees
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">New student enrolled</h6>
                    <small className="text-muted">John Doe - Grade 10A</small>
                  </div>
                  <small className="text-muted">2 hours ago</small>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Fee payment received</h6>
                    <small className="text-muted">Sarah Wilson - $500</small>
                  </div>
                  <small className="text-muted">4 hours ago</small>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Teacher assigned to class</h6>
                    <small className="text-muted">Mr. Smith - Mathematics</small>
                  </div>
                  <small className="text-muted">6 hours ago</small>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Attendance marked</h6>
                    <small className="text-muted">Grade 9B - 95% present</small>
                  </div>
                  <small className="text-muted">8 hours ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
