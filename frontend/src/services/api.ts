import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// attach token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string; role: string }) => 
    api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Student API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id: number) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id: number) => api.get(`/staff/${id}`),
  create: (data: any) => api.post('/staff', data),
  update: (id: number, data: any) => api.put(`/staff/${id}`, data),
  delete: (id: number) => api.delete(`/staff/${id}`),
};

// Class API
export const classAPI = {
  getAll: () => api.get('/classes'),
  getById: (id: number) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: number, data: any) => api.put(`/classes/${id}`, data),
  delete: (id: number) => api.delete(`/classes/${id}`),
};

// Attendance API
export const attendanceAPI = {
  // Mark attendance
  markStudentAttendance: (data: any) => api.post('/attendance/students', data),
  markStaffAttendance: (data: any) => api.post('/attendance/staff', data),
  
  // Get attendance
  getClassAttendance: (classId: number, date: string) => 
    api.get(`/attendance/class/${classId}/${date}`),
  getAttendanceByDateRange: (params: any) => 
    api.get('/attendance/range', { params }),
  getAttendanceStats: (params: any) => 
    api.get('/attendance/stats', { params }),
  getTodayAttendance: () => api.get('/attendance/today'),
  getDashboard: () => api.get('/attendance/dashboard'),
  
  // Student & Staff history
  getStudentHistory: (studentId: number, params?: any) => 
    api.get(`/attendance/student/${studentId}/history`, { params }),
  getStaffHistory: (staffId: number, params?: any) => 
    api.get(`/attendance/staff/${staffId}/history`, { params }),
  
  // Get with status
  getStudentsWithStatus: (classId: number, date: string) => 
    api.get('/attendance/students-status', { params: { classId, date } }),
  getStaffWithStatus: (date: string) => 
    api.get('/attendance/staff-status', { params: { date } }),
  
  // Update & Delete
  update: (id: number, data: any) => api.put(`/attendance/${id}`, data),
  delete: (id: number) => api.delete(`/attendance/${id}`),
};

// Subject API
export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  getById: (id: number) => api.get(`/subjects/${id}`),
  create: (data: any) => api.post('/subjects', data),
  update: (id: number, data: any) => api.put(`/subjects/${id}`, data),
  delete: (id: number) => api.delete(`/subjects/${id}`),
};

// Fee API
export const feeAPI = {
  getAll: () => api.get('/fees'),
  getById: (id: number) => api.get(`/fees/${id}`),
  create: (data: any) => api.post('/fees', data),
  update: (id: number, data: any) => api.put(`/fees/${id}`, data),
  delete: (id: number) => api.delete(`/fees/${id}`),
  recordPayment: (feeId: number, data: any) => api.post(`/fees/${feeId}/payments`, data),
  getPayments: (feeId: number) => api.get(`/fees/${feeId}/payments`),
};

// Exam API
export const examAPI = {
  getAll: () => api.get('/exams'),
  getById: (id: number) => api.get(`/exams/${id}`),
  create: (data: any) => api.post('/exams', data),
  update: (id: number, data: any) => api.put(`/exams/${id}`, data),
  delete: (id: number) => api.delete(`/exams/${id}`),
  addResult: (examId: number, data: any) => api.post(`/exams/${examId}/results`, data),
  getResults: (examId: number) => api.get(`/exams/${examId}/results`),
};

// Report API
export const reportAPI = {
  getStudents: (params?: any) => api.get('/reports/students', { params }),
  getAttendance: (params?: any) => api.get('/reports/attendance', { params }),
  getAcademic: (params?: any) => api.get('/reports/academic', { params }),
  getFinancial: (params?: any) => api.get('/reports/financial', { params }),
  getCustom: (params?: any) => api.get('/reports/custom', { params }),
};

// Dashboard API
export const dashboardAPI = {
  getAdmin: () => api.get('/dashboard/admin'),
  getTeacher: () => api.get('/dashboard/teacher'),
  getStudent: () => api.get('/dashboard/student'),
  getParent: () => api.get('/dashboard/parent'),
};

// Permission API
export const permissionAPI = {
  getAll: () => api.get('/permissions'),
  assignToUser: (userId: number, permissionIds: number[]) => 
    api.post(`/users/${userId}/permissions`, { permissionIds }),
  getUserPermissions: (userId: number) => api.get(`/users/${userId}/permissions`),
};

export default api;