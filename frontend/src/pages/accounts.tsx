import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaPlus, FaSearch, FaEdit, FaTrash, FaCheckCircle, FaClock, FaExclamationTriangle, FaReceipt, FaChartLine } from 'react-icons/fa';
import { feeAPI, studentAPI, classAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';

interface FeeRecord {
  id: number;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  class?: string;
  academicYear?: string;
}

interface PaymentRecord {
  id: number;
  feeId: number;
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
  status: 'completed' | 'pending' | 'failed';
  remarks?: string;
}

interface ExpenseRecord {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  approvedBy?: string;
  status: 'approved' | 'pending' | 'rejected';
  receiptNumber?: string;
}

const AccountsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fees' | 'payments' | 'expenses' | 'reports'>('fees');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('current-month');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const { showNotification } = useNotification();

  // Mock data - replace with actual API calls
  const feeRecords: FeeRecord[] = [
    {
      id: 1,
      studentId: 'STD-001',
      studentName: 'John Doe',
      feeType: 'Tuition Fee',
      amount: 5000,
      dueDate: '2024-01-15',
      status: 'paid',
      paidDate: '2024-01-10',
      paymentMethod: 'Bank Transfer',
      receiptNumber: 'RCP-001',
      class: 'Grade 10-A',
      academicYear: '2024-2025'
    },
    {
      id: 2,
      studentId: 'STD-002',
      studentName: 'Jane Smith',
      feeType: 'Tuition Fee',
      amount: 5000,
      dueDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 3,
      studentId: 'STD-003',
      studentName: 'Mike Johnson',
      feeType: 'Library Fee',
      amount: 500,
      dueDate: '2024-01-10',
      status: 'overdue'
    }
  ];

  const paymentRecords: PaymentRecord[] = [
    {
      id: 1,
      feeId: 1,
      studentId: 'STD-001',
      studentName: 'John Doe',
      amount: 5000,
      paymentDate: '2024-01-10',
      paymentMethod: 'Bank Transfer',
      receiptNumber: 'RCP-001',
      status: 'completed'
    },
    {
      id: 2,
      feeId: 2,
      studentId: 'STD-002',
      studentName: 'Jane Smith',
      amount: 2500,
      paymentDate: '2024-01-12',
      paymentMethod: 'Cash',
      receiptNumber: 'RCP-002',
      status: 'pending'
    }
  ];

  const expenseRecords: ExpenseRecord[] = [
    {
      id: 1,
      description: 'Office Supplies',
      amount: 500,
      category: 'Administrative',
      date: '2024-01-10',
      approvedBy: 'Principal',
      status: 'approved',
      receiptNumber: 'EXP-001'
    },
    {
      id: 2,
      description: 'Computer Equipment',
      amount: 5000,
      category: 'Infrastructure',
      date: '2024-01-08',
      status: 'pending'
    }
  ];

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      const [classesRes, studentsRes] = await Promise.all([
        classAPI.getAll(),
        studentAPI.getAll()
      ]);
      setClasses(classesRes.data.classes || []);
      setStudents(studentsRes.data.students || []);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const filteredFeeRecords = feeRecords.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.feeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesClass = !filterClass || record.class === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const filteredPaymentRecords = paymentRecords.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredExpenseRecords = expenseRecords.filter(record => {
    const matchesSearch = 
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { class: 'bg-success', icon: <FaCheckCircle />, label: 'Paid' },
      pending: { class: 'bg-warning', icon: <FaClock />, label: 'Pending' },
      overdue: { class: 'bg-danger', icon: <FaExclamationTriangle />, label: 'Overdue' },
      completed: { class: 'bg-success', icon: <FaCheckCircle />, label: 'Completed' },
      failed: { class: 'bg-danger', icon: <FaExclamationTriangle />, label: 'Failed' },
      approved: { class: 'bg-success', icon: <FaCheckCircle />, label: 'Approved' },
      rejected: { class: 'bg-danger', icon: <FaExclamationTriangle />, label: 'Rejected' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const calculateTotals = () => {
    const totalFees = feeRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalPaid = feeRecords.filter(r => r.status === 'paid').reduce((sum, record) => sum + record.amount, 0);
    const totalPending = feeRecords.filter(r => r.status === 'pending').reduce((sum, record) => sum + record.amount, 0);
    const totalOverdue = feeRecords.filter(r => r.status === 'overdue').reduce((sum, record) => sum + record.amount, 0);
    const collectionRate = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;

    return { totalFees, totalPaid, totalPending, totalOverdue, collectionRate };
  };

  const totals = calculateTotals();

  const handleRecordPayment = (record: FeeRecord) => {
    setSelectedRecord(record);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      // API call to record payment
      await feeAPI.recordPayment(selectedRecord!.id, paymentData);
      showNotification('Payment recorded successfully', 'success');
      setShowPaymentModal(false);
      setSelectedRecord(null);
      // Refresh data
    } catch (error: any) {
      showNotification('Failed to record payment', 'error');
    }
  };

  return (
    <div className="accounts-module">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaMoneyBillWave className="me-2" />
            Accounts Management
          </h2>
          <p className="text-muted mb-0">Manage school finances, fees, payments, and expenses</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-1" />
          Add Fee Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-primary">
            <div className="stat-icon">💰</div>
            <div className="stat-details">
              <div className="stat-value">${totals.totalFees.toLocaleString()}</div>
              <div className="stat-label">Total Fees</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <div className="stat-value">${totals.totalPaid.toLocaleString()}</div>
              <div className="stat-label">Collected</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-details">
              <div className="stat-value">${totals.totalPending.toLocaleString()}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-info">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <div className="stat-value">{totals.collectionRate}%</div>
              <div className="stat-label">Collection Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header p-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'fees' ? 'active' : ''}`}
                onClick={() => setActiveTab('fees')}
              >
                <FaMoneyBillWave className="me-2" />
                Fee Records
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <FaReceipt className="me-2" />
                Payments
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
                onClick={() => setActiveTab('expenses')}
              >
                <FaExclamationTriangle className="me-2" />
                Expenses
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <FaChartLine className="me-2" />
                Reports
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {activeTab === 'fees' && (
              <>
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
                <div className="col-md-3">
                  <select 
                    className="form-select"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name} - {cls.gradeLevel}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="col-md-2">
              <select 
                className="form-select"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="current-month">Current Month</option>
                <option value="last-month">Last Month</option>
                <option value="current-year">Current Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Fee Records Tab */}
          {activeTab === 'fees' && (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Paid Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeeRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted">
                        No fee records found
                      </td>
                    </tr>
                  ) : (
                    filteredFeeRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.studentId}</td>
                        <td className="fw-bold">{record.studentName}</td>
                        <td>{record.class}</td>
                        <td>{record.feeType}</td>
                        <td className="fw-bold">${record.amount}</td>
                        <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                        <td>{getStatusBadge(record.status)}</td>
                        <td>{record.paidDate ? new Date(record.paidDate).toLocaleDateString() : '-'}</td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            {record.status !== 'paid' && (
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => handleRecordPayment(record)}
                              >
                                Record Payment
                              </button>
                            )}
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
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Receipt #</th>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted">
                        No payment records found
                      </td>
                    </tr>
                  ) : (
                    filteredPaymentRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.receiptNumber}</td>
                        <td className="fw-bold">{record.studentName}</td>
                        <td className="fw-bold">${record.amount}</td>
                        <td>{new Date(record.paymentDate).toLocaleDateString()}</td>
                        <td>{record.paymentMethod}</td>
                        <td>{getStatusBadge(record.status)}</td>
                        <td>{record.remarks || '-'}</td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button className="btn btn-outline-primary btn-sm">
                              <FaEdit />
                            </button>
                            <button className="btn btn-outline-info btn-sm">
                              Print Receipt
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

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Receipt #</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Approved By</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenseRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted">
                        No expense records found
                      </td>
                    </tr>
                  ) : (
                    filteredExpenseRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.receiptNumber || '-'}</td>
                        <td className="fw-bold">{record.description}</td>
                        <td>{record.category}</td>
                        <td className="fw-bold">${record.amount}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.approvedBy || '-'}</td>
                        <td>{getStatusBadge(record.status)}</td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button className="btn btn-outline-primary btn-sm">
                              <FaEdit />
                            </button>
                            <button className="btn btn-outline-success btn-sm">
                              Approve
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
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5>Financial Summary</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Revenue:</span>
                      <strong>${totals.totalPaid.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Pending Amount:</span>
                      <strong>${totals.totalPending.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Collection Rate:</span>
                      <strong>{totals.collectionRate}%</strong>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span>Total Expenses:</span>
                      <strong>$2,500</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Net Profit:</span>
                      <strong className="text-success">${(totals.totalPaid - 2500).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5>Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">
                        <FaChartLine className="me-2" />
                        Generate Financial Report
                      </button>
                      <button className="btn btn-success">
                        <FaReceipt className="me-2" />
                        Print Payment Receipts
                      </button>
                      <button className="btn btn-info">
                        <FaMoneyBillWave className="me-2" />
                        Export to Excel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRecord && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Record Payment - {selectedRecord.studentName}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handlePaymentSubmit({
                    amount: formData.get('amount'),
                    paymentMethod: formData.get('paymentMethod'),
                    remarks: formData.get('remarks')
                  });
                }}>
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="amount" 
                      defaultValue={selectedRecord.amount}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" name="paymentMethod" required>
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                      <option value="card">Card Payment</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <textarea className="form-control" name="remarks" rows={3}></textarea>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      Record Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
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

        .bg-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .bg-info {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
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

        .table td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default AccountsModule;
