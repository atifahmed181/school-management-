import React, { useState } from 'react';
import { FaMoneyBillWave, FaPlus, FaSearch, FaEdit, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

const FeeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data
  const feeRecords: FeeRecord[] = [
    {
      id: '1',
      studentId: 'STD-001',
      studentName: 'John Doe',
      feeType: 'Tuition Fee',
      amount: 5000,
      dueDate: '2024-01-15',
      status: 'paid',
      paidDate: '2024-01-10'
    },
    {
      id: '2',
      studentId: 'STD-002',
      studentName: 'Jane Smith',
      feeType: 'Tuition Fee',
      amount: 5000,
      dueDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: '3',
      studentId: 'STD-003',
      studentName: 'Mike Johnson',
      feeType: 'Library Fee',
      amount: 500,
      dueDate: '2024-01-10',
      status: 'overdue'
    }
  ];

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { class: 'bg-success', icon: <FaCheckCircle /> },
      pending: { class: 'bg-warning', icon: <FaClock /> },
      overdue: { class: 'bg-danger', icon: <FaClock /> }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        {config.icon} {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="fee-management">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaMoneyBillWave className="me-2" />
            Fee Management
          </h2>
          <p className="text-muted mb-0">Manage student fees and payments</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-1" />
          Add Fee Record
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-primary">
            <div className="stat-icon">💰</div>
            <div className="stat-details">
              <div className="stat-value">$15,000</div>
              <div className="stat-label">Total Collected</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-details">
              <div className="stat-value">$5,000</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-danger">
            <div className="stat-icon">⚠️</div>
            <div className="stat-details">
              <div className="stat-value">$500</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <div className="stat-value">75%</div>
              <div className="stat-label">Collection Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Paid Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No fee records found
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.studentId}</td>
                      <td>{record.studentName}</td>
                      <td>{record.feeType}</td>
                      <td className="fw-bold">${record.amount}</td>
                      <td>{record.dueDate}</td>
                      <td>{getStatusBadge(record.status)}</td>
                      <td>{record.paidDate || '-'}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-outline-primary btn-sm">
                            <FaEdit />
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
          margin-bottom: 1rem;
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

        .bg-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .bg-danger {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .bg-success {
          background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
        }
      `}</style>
    </div>
  );
};

export default FeeManagement;

