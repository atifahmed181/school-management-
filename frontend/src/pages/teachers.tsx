import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaSearch, FaEdit, FaTrash, FaChalkboardTeacher 
} from 'react-icons/fa';
import { staffAPI } from '../services/api';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department?: string;
  subjects?: string[];
  phone?: string;
  status: string;
}

interface FormErrors {
  [key: string]: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const response = await staffAPI.getAll();
      if (response.data && response.data.staff && Array.isArray(response.data.staff)) {
        // Map backend staff data to frontend teacher format
        const mappedTeachers = response.data.staff.map((s: any) => ({
          id: s.id.toString(),
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          email: s.email || '',
          employeeId: s.employeeId || '',
          department: s.department || '',
          subjects: s.subjects ? s.subjects.split(',').map((sub: string) => sub.trim()) : [],
          phone: s.phoneNumber || '',
          status: s.status || 'Active'
        }));
        setTeachers(mappedTeachers);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Failed loading teachers', err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (teacher: Teacher | null = null) => {
    setCurrentTeacher(teacher);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTeacher(null);
    setSaving(false);
    setSaveError('');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setSaving(true);
    setSaveError('');
    setErrors({});

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Build payload object for staff API
    const payload: any = {
      employeeId: formData.get('employeeId') || '',
      firstName: formData.get('firstName') || '',
      lastName: formData.get('lastName') || '',
      email: formData.get('email') || '',
      phoneNumber: formData.get('phone') || '',
      department: formData.get('department') || '',
      position: 'Teacher',
      // Required fields for backend
      dateOfBirth: formData.get('dateOfBirth') || '1990-01-01',
      gender: formData.get('gender') || 'male',
      address: formData.get('address') || 'N/A',
      city: formData.get('city') || 'N/A',
      state: formData.get('state') || 'N/A',
      postalCode: formData.get('postalCode') || '00000',
      hireDate: formData.get('hireDate') || new Date().toISOString().split('T')[0],
      salary: parseFloat(formData.get('salary') as string) || 0,
      status: 'active'
    };

    // Handle subjects (convert from comma-separated string to backend format)
    const subjectsInput = formData.get('subjects') as string;
    if (subjectsInput) {
      payload.subjects = subjectsInput;
    }

    // Client-side validation
    const newErrors: FormErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    
    if (!payload.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!payload.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!payload.email?.trim() || !emailRegex.test(payload.email)) newErrors.email = 'Valid email is required';
    if (!payload.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      console.log('Saving teacher data:', payload);
      
      if (currentTeacher) {
        // Update existing teacher
        await staffAPI.update(parseInt(currentTeacher.id), payload);
      } else {
        // Create new teacher
        await staffAPI.create(payload);
      }
      
      console.log('Teacher saved successfully');
      await loadTeachers();
      handleCloseModal();
    } catch (err: any) {
      let errorMessage = 'Failed to save. Please try again.';
      
      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setSaveError(errorMessage);
      setSaving(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || teacher.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <FaChalkboardTeacher className="me-2" />
              Teacher Management
            </h2>
            <button 
              className="btn btn-primary"
              onClick={() => handleShowModal()}
            >
              <FaPlus className="me-1" />
              Add Teacher
            </button>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-lg-4 mb-3 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search teachers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <select 
                    className="form-select"
                    value={filterDepartment} 
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Subjects</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredTeachers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted">
                          No teachers found
                        </td>
                      </tr>
                    ) : (
                      filteredTeachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td>{teacher.employeeId}</td>
                          <td>{teacher.firstName} {teacher.lastName}</td>
                          <td>{teacher.email}</td>
                          <td>{teacher.department}</td>
                          <td>
                            {teacher.subjects && teacher.subjects.length > 0 
                              ? teacher.subjects.join(', ') 
                              : 'Not assigned'
                            }
                          </td>
                          <td>{teacher.phone}</td>
                          <td>
                            <span className={`badge ${teacher.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                              {teacher.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleShowModal(teacher)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this teacher?')) {
                                    setTeachers(teachers.filter(t => t.id !== teacher.id));
                                  }
                                }}
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
        </div>
      </div>

      {/* Add/Edit Teacher Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form id="teacherForm" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          defaultValue={currentTeacher ? currentTeacher.firstName : ''}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          defaultValue={currentTeacher ? currentTeacher.lastName : ''}
                          placeholder="Enter last name"
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          defaultValue={currentTeacher ? currentTeacher.email : ''}
                          placeholder="Enter email address"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Employee ID</label>
                        <input
                          type="text"
                          name="employeeId"
                          className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
                          defaultValue={currentTeacher ? currentTeacher.employeeId : ''}
                          placeholder="Enter employee ID"
                        />
                        {errors.employeeId && <div className="invalid-feedback">{errors.employeeId}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Department</label>
                        <select name="department" className="form-select" defaultValue={currentTeacher?.department || ''}>
                          <option value="">Select Department</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Science">Science</option>
                          <option value="English">English</option>
                          <option value="Social Studies">Social Studies</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          defaultValue={currentTeacher ? currentTeacher.phone : ''}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select name="gender" className="form-select">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          placeholder="Enter address"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          placeholder="Enter city"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          name="state"
                          className="form-control"
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          className="form-control"
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Hire Date</label>
                        <input
                          type="date"
                          name="hireDate"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Salary</label>
                        <input
                          type="number"
                          name="salary"
                          className="form-control"
                          placeholder="Enter salary"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Subjects</label>
                    <input
                      type="text"
                      name="subjects"
                      className="form-control"
                      defaultValue={currentTeacher?.subjects ? currentTeacher.subjects.join(', ') : ''}
                      placeholder="Enter subjects (comma separated)"
                    />
                  </div>

                  {saveError && (
                    <div className="alert alert-danger">{saveError}</div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="teacherForm"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {currentTeacher ? 'Update Teacher' : 'Add Teacher'}
                  {saving ? '...' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
