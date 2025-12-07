import React, { useState, useEffect, useRef } from 'react';
import {
  FaPlus, FaSearch, FaEdit, FaTrash, FaUserGraduate,
  FaEllipsisV, FaFilter, FaDownload, FaUpload, FaEye
} from 'react-icons/fa';
import { studentAPI } from '../services/api';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  rollNumber: string;
  class?: string;
  section?: string;
  parentName?: string;
  status: string;
  admissionDate: string;
}

interface FormErrors {
  [key: string]: string;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await studentAPI.getAll();
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Map backend data to frontend format
        const mappedStudents = response.data.data.map((s: any) => ({
          id: s.id.toString(),
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          email: s.email || '',
          studentId: s.studentId || '',
          rollNumber: s.rollNumber || '',
          class: s.currentClass || '',
          section: s.section || '',
          parentName: s.fatherName || '',
          status: s.status || 'Active',
          admissionDate: s.admissionDate || ''
        }));
        setStudents(mappedStudents);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleShowModal = (student: Student | null = null) => {
    console.log('handleShowModal called', { student });
    setCurrentStudent(student);
    setShowModal(true);
    console.log('Modal state updated', { showModal: true, currentStudent: student });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStudent(null);
    setSaving(false);
    setSaveError('');
    setSelectedPhoto(null);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setSaving(true);
    setSaveError('');
    setErrors({});

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log('Form data:', Object.fromEntries(formData));

    // Build payload object with proper field mapping
    // Helper to safely get string from formData
    const getString = (key: string): string => {
      const value = formData.get(key);
      return typeof value === 'string' ? value : '';
    };

    // Build payload object with proper field mapping
    const payload = {
      firstName: getString('firstName'),
      lastName: getString('lastName'),
      email: getString('email'),
      studentId: getString('studentId'),
      rollNumber: getString('rollNumber'),
      admissionDate: getString('admissionDate'),
      dateOfBirth: getString('dateOfBirth'),
      admissionClass: getString('admissionClass'),
      currentClass: getString('currentClass'),
      section: getString('section'),
      gender: getString('gender'),
      phoneNumber: getString('phone'),
      fatherName: getString('fatherName'),
      fatherCnic: getString('fatherCnic'),
      fatherCell: getString('fatherCell'),
      fatherOccupation: getString('fatherOccupation'),
      motherName: getString('motherName'),
      motherCnic: getString('motherCnic'),
      motherCell: getString('motherCell'),
      childNumber: getString('childNumber'),
      status: 'active',
    };

    // Client-side validation
    const newErrors: FormErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!payload.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!payload.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!payload.email?.trim() || !emailRegex.test(payload.email)) newErrors.email = 'Valid email is required';
    if (!payload.studentId?.trim()) newErrors.studentId = 'Student ID is required';
    if (!payload.rollNumber?.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!payload.admissionDate) newErrors.admissionDate = 'Admission date is required';
    if (!payload.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!payload.admissionClass) newErrors.admissionClass = 'Admission class is required';
    if (!payload.currentClass) newErrors.currentClass = 'Present class is required';
    if (!payload.section) newErrors.section = 'Section is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      // Call the actual API
      console.log('Saving student data:', payload);
      const response = await studentAPI.create(payload);

      if (response.data && response.data.success) {
        setSaveSuccess(true);
        console.log('Student saved successfully:', response.data.data);
        // Reload the students list to show the new student
        await loadStudents();
        handleCloseModal();
      } else {
        throw new Error('Failed to save student');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to save. Please try again.';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        errorMessage = 'Validation failed:\n' + validationErrors.map((e: any) => `• ${e.msg} (field: ${e.param})`).join('\n');
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setSaveError(errorMessage);
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = !filterClass || student.class === filterClass;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="container-fluid py-3">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div>
              <h2 className="d-flex align-items-center">
                <FaUserGraduate className="me-2" />
                Student Management
              </h2>
              <p className="text-muted mb-0">Manage all student information and records</p>
            </div>
            <div className="mt-3 mt-md-0">
              <button
                className="btn btn-primary"
                onClick={() => {
                  console.log('Add button clicked');
                  handleShowModal();
                }}
              >
                <FaPlus className="me-1" />
                Add Student
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="card mt-3">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-xs-12 col-md-6 mb-3 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-6">
                  <div className="d-flex flex-wrap gap-2">
                    <select
                      className="form-select flex-grow-1"
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                    >
                      <option value="">All Classes</option>
                      <option value="10-A">10-A</option>
                      <option value="10-B">10-B</option>
                      <option value="9-A">9-A</option>
                      <option value="9-B">9-B</option>
                    </select>
                    <button
                      className="btn btn-outline-secondary d-md-none"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FaFilter />
                    </button>
                    <div className="d-none d-md-flex gap-2">
                      <button className="btn btn-outline-success btn-sm">
                        <FaDownload className="me-1" /> Export
                      </button>
                      <button className="btn btn-outline-info btn-sm">
                        <FaUpload className="me-1" /> Import
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Class</th>
                      <th>Roll No</th>
                      <th>Parent</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingStudents ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.studentId}</td>
                          <td>
                            <div>{student.firstName} {student.lastName}</div>
                            <small className="text-muted d-block">{student.admissionDate}</small>
                          </td>
                          <td>{student.email}</td>
                          <td>{student.class} - {student.section}</td>
                          <td>{student.rollNumber}</td>
                          <td>{student.parentName}</td>
                          <td>
                            <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleShowModal(student)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="btn btn-outline-info btn-sm"
                              >
                                <FaEye />
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this student?')) {
                                    setStudents(students.filter(s => s.id !== student.id));
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

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div className="modal-dialog modal-xl" style={{ position: 'relative', zIndex: 1051 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentStudent ? 'Edit Student' : 'Add New Student'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                <form id="studentForm" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Photo Upload */}
                    <div className="col-md-2">
                      <div
                        className="border-2 border-dashed rounded p-2 text-center"
                        style={{
                          width: '110px',
                          height: '120px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        onClick={() => document.getElementById('photoInput')?.click()}
                      >
                        {selectedPhoto ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <img
                              src={URL.createObjectURL(selectedPhoto)}
                              alt="Preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            <i className="fas fa-camera fa-lg text-muted mb-1"></i>
                            <div className="text-muted" style={{ fontSize: '10px', lineHeight: '1.2' }}>
                              Upload Photo<br />
                              <span style={{ fontSize: '9px' }}>or Drag & Drop here</span>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          id="photoInput"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handlePhotoUpload}
                        />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              className={`form-control form-control-sm ${errors.firstName ? 'is-invalid' : ''}`}
                              defaultValue={currentStudent ? currentStudent.firstName : ''}
                              placeholder="First name"
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              className={`form-control form-control-sm ${errors.lastName ? 'is-invalid' : ''}`}
                              defaultValue={currentStudent ? currentStudent.lastName : ''}
                              placeholder="Last name"
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Email</label>
                            <input
                              type="email"
                              name="email"
                              className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                              defaultValue={currentStudent ? currentStudent.email : ''}
                              placeholder="Email"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              className="form-control form-control-sm"
                              placeholder="Phone"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Student ID</label>
                            <input
                              type="text"
                              name="studentId"
                              className={`form-control form-control-sm ${errors.studentId ? 'is-invalid' : ''}`}
                              defaultValue={currentStudent ? currentStudent.studentId : ''}
                              placeholder="Student ID"
                            />
                            {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Roll Number</label>
                            <input
                              type="text"
                              name="rollNumber"
                              className={`form-control form-control-sm ${errors.rollNumber ? 'is-invalid' : ''}`}
                              defaultValue={currentStudent ? currentStudent.rollNumber : ''}
                              placeholder="Roll Number"
                            />
                            {errors.rollNumber && <div className="invalid-feedback">{errors.rollNumber}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Admission Date</label>
                            <input
                              type="date"
                              name="admissionDate"
                              className={`form-control form-control-sm ${errors.admissionDate ? 'is-invalid' : ''}`}
                            />
                            {errors.admissionDate && <div className="invalid-feedback">{errors.admissionDate}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Date of Birth</label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              className={`form-control form-control-sm ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                            />
                            {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Admission Class</label>
                            <input
                              type="text"
                              name="admissionClass"
                              className={`form-control form-control-sm ${errors.admissionClass ? 'is-invalid' : ''}`}
                              placeholder="e.g., Grade 1"
                            />
                            {errors.admissionClass && <div className="invalid-feedback">{errors.admissionClass}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Present Class</label>
                            <input
                              type="text"
                              name="currentClass"
                              className={`form-control form-control-sm ${errors.currentClass ? 'is-invalid' : ''}`}
                              placeholder="e.g., Grade 5"
                            />
                            {errors.currentClass && <div className="invalid-feedback">{errors.currentClass}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Section</label>
                            <input
                              type="text"
                              name="section"
                              className={`form-control form-control-sm ${errors.section ? 'is-invalid' : ''}`}
                              placeholder="e.g., A"
                            />
                            {errors.section && <div className="invalid-feedback">{errors.section}</div>}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-2">
                            <label className="form-label small">Gender</label>
                            <select name="gender" className="form-select form-select-sm">
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parents Info */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary mb-2">Father's Information</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Father's Name</label>
                            <input
                              type="text"
                              name="fatherName"
                              className="form-control form-control-sm"
                              placeholder="Father's name"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Father's CNIC</label>
                            <input
                              type="text"
                              name="fatherCnic"
                              className="form-control form-control-sm"
                              placeholder="XXXXX-XXXXXXX-X"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Father's Cell</label>
                            <input
                              type="text"
                              name="fatherCell"
                              className="form-control form-control-sm"
                              placeholder="03XX-XXXXXXX"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Father's Occupation</label>
                            <input
                              type="text"
                              name="fatherOccupation"
                              className="form-control form-control-sm"
                              placeholder="Occupation"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h6 className="text-primary mb-2">Mother's Information</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Mother's Name</label>
                            <input
                              type="text"
                              name="motherName"
                              className="form-control form-control-sm"
                              placeholder="Mother's name"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Mother's CNIC</label>
                            <input
                              type="text"
                              name="motherCnic"
                              className="form-control form-control-sm"
                              placeholder="XXXXX-XXXXXXX-X"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Mother's Cell</label>
                            <input
                              type="text"
                              name="motherCell"
                              className="form-control form-control-sm"
                              placeholder="03XX-XXXXXXX"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <label className="form-label small">Child Number</label>
                            <select name="childNumber" className="form-select form-select-sm">
                              <option value="">Select</option>
                              <option value="first">First</option>
                              <option value="second">Second</option>
                              <option value="third">Third</option>
                              <option value="fourth">Fourth</option>
                              <option value="fifth">Fifth</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {saveError && (
                    <div className="alert alert-danger small mb-2">{saveError}</div>
                  )}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {currentStudent ? 'Update Student' : 'Add Student'}
                      {saving ? '...' : ''}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
