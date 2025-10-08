import React, { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaSearch, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import { classAPI, staffAPI } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

interface Class {
  id: number;
  name: string;
  gradeLevel: string;
  section: string;
  academicYear: string;
  capacity: number;
  currentEnrollment: number;
  teacherId?: number;
  description?: string;
  roomNumber?: string;
  schedule?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ClassStats {
  overall: {
    totalClasses: number;
    activeClasses: number;
    totalEnrollment: number;
    totalCapacity: number;
  };
  byGradeLevel: Array<{
    gradeLevel: string;
    classCount: number;
    totalEnrollment: number;
    totalCapacity: number;
  }>;
}

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gradeLevel: '',
    academicYear: '',
    isActive: ''
  });
  const { showNotification } = useNotification();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    gradeLevel: '',
    section: '',
    academicYear: '',
    capacity: 30,
    teacherId: '',
    description: '',
    roomNumber: '',
    schedule: '',
    isActive: true
  });

  useEffect(() => {
    fetchClasses();
    fetchStaff();
    fetchStats();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getAll();
      setClasses(response.data.classes || []);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch classes';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data.staff || []);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  const fetchStats = async () => {
    try {
      // Calculate stats from classes data
      const totalClasses = classes.length;
      const activeClasses = classes.filter(c => c.isActive).length;
      const totalEnrollment = classes.reduce((sum, c) => sum + (c.currentEnrollment || 0), 0);
      const totalCapacity = classes.reduce((sum, c) => sum + (c.capacity || 0), 0);

      const gradeLevelStats = classes.reduce((acc, cls) => {
        const grade = cls.gradeLevel;
        if (!acc[grade]) {
          acc[grade] = { classCount: 0, totalEnrollment: 0, totalCapacity: 0 };
        }
        acc[grade].classCount++;
        acc[grade].totalEnrollment += cls.currentEnrollment || 0;
        acc[grade].totalCapacity += cls.capacity || 0;
        return acc;
      }, {} as any);

      setStats({
        overall: { totalClasses, activeClasses, totalEnrollment, totalCapacity },
        byGradeLevel: Object.entries(gradeLevelStats).map(([gradeLevel, data]: [string, any]) => ({
          gradeLevel,
          classCount: data.classCount,
          totalEnrollment: data.totalEnrollment,
          totalCapacity: data.totalCapacity
        }))
      });
    } catch (err) {
      console.error('Failed to calculate stats:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
        capacity: parseInt(formData.capacity.toString())
      };
      
      await classAPI.create(payload);
      setShowCreateModal(false);
      resetForm();
      fetchClasses();
      showNotification('Class created successfully', 'success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create class';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    
    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
        capacity: parseInt(formData.capacity.toString())
      };
      
      await classAPI.update(selectedClass.id, payload);
      setShowEditModal(false);
      setSelectedClass(null);
      resetForm();
      fetchClasses();
      showNotification('Class updated successfully', 'success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update class';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) return;
    
    try {
      await classAPI.delete(id);
      fetchClasses();
      showNotification('Class deleted successfully', 'success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete class';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gradeLevel: '',
      section: '',
      academicYear: '',
      capacity: 30,
      teacherId: '',
      description: '',
      roomNumber: '',
      schedule: '',
      isActive: true
    });
  };

  const openEditModal = (classData: Class) => {
    setSelectedClass(classData);
    setFormData({
      name: classData.name,
      gradeLevel: classData.gradeLevel,
      section: classData.section,
      academicYear: classData.academicYear,
      capacity: classData.capacity,
      teacherId: classData.teacherId?.toString() || '',
      description: classData.description || '',
      roomNumber: classData.roomNumber || '',
      schedule: classData.schedule || '',
      isActive: classData.isActive
    });
    setShowEditModal(true);
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.gradeLevel.includes(searchTerm) ||
                         cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cls.teacher && `${cls.teacher.firstName} ${cls.teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGrade = !filters.gradeLevel || cls.gradeLevel === filters.gradeLevel;
    const matchesYear = !filters.academicYear || cls.academicYear === filters.academicYear;
    const matchesActive = filters.isActive === '' || 
                         (filters.isActive === 'true' && cls.isActive) ||
                         (filters.isActive === 'false' && !cls.isActive);

    return matchesSearch && matchesGrade && matchesYear && matchesActive;
  });

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="badge bg-success d-flex align-items-center gap-1">
        <FaCheckCircle /> Active
      </span>
    ) : (
      <span className="badge bg-danger d-flex align-items-center gap-1">
        <FaTimesCircle /> Inactive
      </span>
    );
  };

  const getEnrollmentProgress = (current: number, capacity: number) => {
    const percentage = capacity > 0 ? Math.round((current / capacity) * 100) : 0;
    const colorClass = percentage >= 90 ? 'bg-danger' : percentage >= 75 ? 'bg-warning' : 'bg-success';
    
    return (
      <div>
        <div className="d-flex justify-content-between">
          <span className="fw-bold">{current}/{capacity}</span>
          <span className="text-muted">{percentage}%</span>
        </div>
        <div className="progress mt-1" style={{ height: '6px' }}>
          <div 
            className={`progress-bar ${colorClass}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classes-management">
      <div className="page-header mb-4">
        <div>
          <h2 className="d-flex align-items-center mb-2">
            <FaUsers className="me-2" />
            Class Management
          </h2>
          <p className="text-muted mb-0">Manage classes, sections, and student enrollment</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="me-1" />
          Add New Class
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card bg-primary">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-details">
                <div className="stat-value">{stats.overall.totalClasses}</div>
                <div className="stat-label">Total Classes</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-success">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-details">
                <div className="stat-value">{stats.overall.activeClasses}</div>
                <div className="stat-label">Active Classes</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-info">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-details">
                <div className="stat-value">{stats.overall.totalEnrollment}</div>
                <div className="stat-label">Total Enrollment</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-warning">
              <div className="stat-icon">
                <FaCalendarAlt />
              </div>
              <div className="stat-details">
                <div className="stat-value">{stats.overall.totalCapacity}</div>
                <div className="stat-label">Total Capacity</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search classes, teachers, or sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.gradeLevel}
                onChange={(e) => setFilters({...filters, gradeLevel: e.target.value})}
              >
                <option value="">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.academicYear}
                onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
              >
                <option value="">All Years</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.isActive}
                onChange={(e) => setFilters({...filters, isActive: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Classes Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Grade & Section</th>
                  <th>Academic Year</th>
                  <th>Class Teacher</th>
                  <th>Enrollment</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      <FaUsers size={48} className="mb-3" />
                      <p>No classes found matching your criteria.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <FaPlus className="me-1" />
                        Create First Class
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((cls) => (
                    <tr key={cls.id}>
                      <td>
                        <div className="fw-bold">{cls.name}</div>
                        {cls.description && (
                          <div className="text-muted small">{cls.description}</div>
                        )}
                      </td>
                      <td>
                        <div className="fw-bold">Grade {cls.gradeLevel}-{cls.section}</div>
                        {cls.schedule && (
                          <div className="text-muted small">{cls.schedule}</div>
                        )}
                      </td>
                      <td>{cls.academicYear}</td>
                      <td>
                        {cls.teacher ? (
                          <div>
                            <div className="fw-bold">{cls.teacher.firstName} {cls.teacher.lastName}</div>
                            <div className="text-muted small">{cls.teacher.email}</div>
                          </div>
                        ) : (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>
                      <td>
                        {getEnrollmentProgress(cls.currentEnrollment, cls.capacity)}
                      </td>
                      <td>
                        {cls.roomNumber ? (
                          <span className="badge bg-secondary">{cls.roomNumber}</span>
                        ) : (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>
                      <td>{getStatusBadge(cls.isActive)}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openEditModal(cls)}
                            title="Edit Class"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(cls.id)}
                            title="Delete Class"
                          >
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Class</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Class Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Grade Level *</label>
                      <select
                        className="form-select"
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Section *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.section}
                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Academic Year *</label>
                      <select
                        className="form-select"
                        value={formData.academicYear}
                        onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Capacity *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Class Teacher</label>
                      <select
                        className="form-select"
                        value={formData.teacherId}
                        onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                      >
                        <option value="">Select Teacher</option>
                        {staff.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.firstName} {teacher.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Room Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Schedule</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.schedule}
                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                        placeholder="e.g., Mon-Fri 8:00 AM - 3:00 PM"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <label className="form-check-label">Active Class</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedClass && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Class - {selectedClass.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedClass(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Class Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Grade Level *</label>
                      <select
                        className="form-select"
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Section *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.section}
                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Academic Year *</label>
                      <select
                        className="form-select"
                        value={formData.academicYear}
                        onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Capacity *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Class Teacher</label>
                      <select
                        className="form-select"
                        value={formData.teacherId}
                        onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                      >
                        <option value="">Select Teacher</option>
                        {staff.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.firstName} {teacher.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Room Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Schedule</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.schedule}
                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                        placeholder="e.g., Mon-Fri 8:00 AM - 3:00 PM"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <label className="form-check-label">Active Class</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedClass(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Class
                  </button>
                </div>
              </form>
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

        .bg-info {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
        }

        .bg-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .badge {
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .table td {
          vertical-align: middle;
        }

        .progress {
          background-color: #e9ecef;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default ClassesPage;
