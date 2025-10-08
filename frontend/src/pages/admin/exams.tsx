import React, { useState } from 'react';
import { FaClipboardList, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaUsers } from 'react-icons/fa';

interface Exam {
  id: string;
  name: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  passingMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  studentsEnrolled: number;
}

const ExaminationManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data
  const exams: Exam[] = [
    {
      id: '1',
      name: 'Mid Term Examination',
      subject: 'Mathematics',
      class: 'Grade 10-A',
      date: '2024-03-15',
      time: '09:00 AM',
      duration: '2 hours',
      totalMarks: 100,
      passingMarks: 40,
      status: 'upcoming',
      studentsEnrolled: 45
    },
    {
      id: '2',
      name: 'Final Term Examination',
      subject: 'Science',
      class: 'Grade 9-B',
      date: '2024-02-10',
      time: '10:00 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      status: 'completed',
      studentsEnrolled: 40
    },
    {
      id: '3',
      name: 'Unit Test',
      subject: 'English',
      class: 'Grade 11-A',
      date: '2024-02-20',
      time: '11:00 AM',
      duration: '1 hour',
      totalMarks: 50,
      passingMarks: 20,
      status: 'ongoing',
      studentsEnrolled: 38
    }
  ];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { class: 'bg-info', text: 'Upcoming', icon: <FaCalendarAlt /> },
      ongoing: { class: 'bg-warning', text: 'Ongoing', icon: <FaClipboardList /> },
      completed: { class: 'bg-success', text: 'Completed', icon: <FaEye /> }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  return (
    <div className="examination-management">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaClipboardList className="me-2" />
            Examination Management
          </h2>
          <p className="text-muted mb-0">Manage exams, schedules, and results</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-1" />
          Schedule New Exam
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
                  placeholder="Search by exam name, subject, or class..."
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
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📝</div>
            <div className="stat-details">
              <div className="stat-value">24</div>
              <div className="stat-label">Total Exams</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-info">
            <div className="stat-icon">📅</div>
            <div className="stat-details">
              <div className="stat-value">8</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-warning">
            <div className="stat-icon">⏱️</div>
            <div className="stat-details">
              <div className="stat-value">3</div>
              <div className="stat-label">Ongoing</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-success">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <div className="stat-value">13</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Marks</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-muted">
                      No exams found
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam) => (
                    <tr key={exam.id}>
                      <td className="fw-bold">{exam.name}</td>
                      <td>{exam.subject}</td>
                      <td>
                        <span className="badge bg-secondary">{exam.class}</span>
                      </td>
                      <td>
                        <div>{exam.date}</div>
                        <small className="text-muted">{exam.time}</small>
                      </td>
                      <td>{exam.duration}</td>
                      <td>
                        <div className="fw-bold">{exam.totalMarks}</div>
                        <small className="text-muted">Pass: {exam.passingMarks}</small>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          <FaUsers /> {exam.studentsEnrolled}
                        </span>
                      </td>
                      <td>{getStatusBadge(exam.status)}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-outline-info btn-sm" title="View Details">
                            <FaEye />
                          </button>
                          <button className="btn btn-outline-primary btn-sm" title="Edit">
                            <FaEdit />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" title="Delete">
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

        .stat-info {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .stat-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .stat-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
      `}</style>
    </div>
  );
};

export default ExaminationManagement;

