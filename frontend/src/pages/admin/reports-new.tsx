import React, { useState } from 'react';
import { FaChartBar, FaDownload, FaFileAlt, FaFilter, FaCalendarAlt, FaUserGraduate, FaMoneyBillWave, FaClipboardCheck } from 'react-icons/fa';

interface Report {
  id: string;
  name: string;
  category: string;
  description: string;
  lastGenerated: string;
  frequency: string;
  status: 'available' | 'generating' | 'pending';
}

const ReportsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock data
  const reports: Report[] = [
    {
      id: '1',
      name: 'Student Performance Report',
      category: 'Academic',
      description: 'Comprehensive analysis of student academic performance',
      lastGenerated: '2024-02-15',
      frequency: 'Monthly',
      status: 'available'
    },
    {
      id: '2',
      name: 'Attendance Summary',
      category: 'Attendance',
      description: 'Monthly attendance statistics for all classes',
      lastGenerated: '2024-02-14',
      frequency: 'Weekly',
      status: 'available'
    },
    {
      id: '3',
      name: 'Fee Collection Report',
      category: 'Financial',
      description: 'Fee collection status and outstanding amounts',
      lastGenerated: '2024-02-10',
      frequency: 'Monthly',
      status: 'generating'
    },
    {
      id: '4',
      name: 'Exam Results Analysis',
      category: 'Academic',
      description: 'Detailed exam results with statistical analysis',
      lastGenerated: '2024-02-05',
      frequency: 'Quarterly',
      status: 'available'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || report.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { class: 'bg-success', text: 'Available' },
      generating: { class: 'bg-warning', text: 'Generating...' },
      pending: { class: 'bg-secondary', text: 'Pending' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getCategoryIcon = (category: string) => {
    const icons: {[key: string]: JSX.Element} = {
      'Academic': <FaUserGraduate />,
      'Financial': <FaMoneyBillWave />,
      'Attendance': <FaClipboardCheck />
    };
    return icons[category] || <FaFileAlt />;
  };

  return (
    <div className="reports-management">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaChartBar className="me-2" />
            Reports & Analytics
          </h2>
          <p className="text-muted mb-0">Generate and download various reports</p>
        </div>
        <button className="btn btn-primary">
          <FaFileAlt className="me-1" />
          Create Custom Report
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text">
                  <FaFilter />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <select 
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Financial">Financial</option>
                <option value="Attendance">Attendance</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
            <div className="col-md-2 mb-3 mb-md-0">
              <input
                type="date"
                className="form-control"
                placeholder="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                placeholder="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <div className="stat-value">45</div>
              <div className="stat-label">Total Reports</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-success">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <div className="stat-value">38</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-details">
              <div className="stat-value">5</div>
              <div className="stat-label">Generating</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-info">
            <div className="stat-icon">📅</div>
            <div className="stat-details">
              <div className="stat-value">12</div>
              <div className="stat-label">This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="row">
        {filteredReports.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5 text-muted">
                No reports found
              </div>
            </div>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="col-md-6 mb-4">
              <div className="report-card card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="report-icon me-3">
                      {getCategoryIcon(report.category)}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-2">{report.name}</h5>
                      <span className="badge bg-info me-2">{report.category}</span>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  
                  <p className="card-text text-muted mb-3">{report.description}</p>
                  
                  <div className="report-meta mb-3">
                    <small className="text-muted d-block">
                      <FaCalendarAlt className="me-1" />
                      Last Generated: {report.lastGenerated}
                    </small>
                    <small className="text-muted d-block">
                      Frequency: <strong>{report.frequency}</strong>
                    </small>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm flex-grow-1" disabled={report.status === 'generating'}>
                      <FaDownload className="me-1" />
                      {report.status === 'generating' ? 'Generating...' : 'Download'}
                    </button>
                    <button className="btn btn-outline-primary btn-sm">
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Report Actions */}
      <div className="card mt-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Quick Report Actions</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <button className="btn btn-outline-primary w-100 mb-2">
                <FaUserGraduate className="me-2" />
                Student List
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-success w-100 mb-2">
                <FaClipboardCheck className="me-2" />
                Attendance Today
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-warning w-100 mb-2">
                <FaMoneyBillWave className="me-2" />
                Fee Defaulters
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-info w-100 mb-2">
                <FaChartBar className="me-2" />
                Performance Analysis
              </button>
            </div>
          </div>
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
          margin-bottom: 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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

        .stat-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .stat-success {
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }

        .stat-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .stat-info {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
        }

        .report-card {
          transition: all 0.3s ease;
          border: 1px solid #e0e0e0;
        }

        .report-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .report-icon {
          font-size: 2rem;
          color: #667eea;
          background: #f0f0ff;
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-meta {
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          padding: 0.75rem 0;
        }

        .card-title {
          color: #2d3748;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ReportsManagement;


