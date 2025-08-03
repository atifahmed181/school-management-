// User and Authentication Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  role_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: number;
  name: string;
  displayName: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Student Types
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  studentId: string;
  currentClass: string;
  section?: string;
  rollNumber?: number;
  admissionDate: string;
  previousSchool?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  alternatePhone?: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation?: string;
  fatherName: string;
  fatherOccupation?: string;
  fatherPhone?: string;
  motherName: string;
  motherOccupation?: string;
  motherPhone?: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated' | 'suspended';
  remarks?: string;
  user_id?: number;
  createdAt: string;
  updatedAt: string;
}

// Staff Types
export interface Staff {
  id: number;
  user_id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  alternatePhone?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  hireDate: string;
  position: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Class Types
export interface Class {
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
}

// Subject Types
export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits: number;
  gradeLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Fee Types
export interface Fee {
  id: number;
  name: string;
  description?: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one_time';
  dueDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeePayment {
  id: number;
  feeId: number;
  studentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'check' | 'card' | 'bank_transfer';
  receiptNumber?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Exam Types
export interface Exam {
  id: number;
  name: string;
  subjectId: number;
  classId: number;
  examDate: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  examType: 'mid_term' | 'final' | 'quiz' | 'assignment';
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  obtainedMarks: number;
  grade?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  totalExams: number;
  attendanceRate: number;
  averageGrade: number;
  totalFees: number;
  collectedFees: number;
}

export interface AdminDashboard extends DashboardStats {
  recentStudents: Student[];
  recentStaff: Staff[];
  upcomingExams: Exam[];
  feeCollection: {
    month: string;
    amount: number;
  }[];
}

export interface TeacherDashboard extends DashboardStats {
  myClasses: Class[];
  myStudents: Student[];
  upcomingExams: Exam[];
  attendanceSummary: {
    date: string;
    present: number;
    absent: number;
  }[];
}

export interface StudentDashboard {
  profile: Student;
  currentClass: Class;
  attendance: Attendance[];
  examResults: ExamResult[];
  feePayments: FeePayment[];
  upcomingExams: Exam[];
}

export interface ParentDashboard {
  children: Student[];
  attendance: Attendance[];
  examResults: ExamResult[];
  feePayments: FeePayment[];
  upcomingExams: Exam[];
}

// Report Types
export interface StudentReport {
  student: Student;
  attendance: {
    total: number;
    present: number;
    absent: number;
    percentage: number;
  };
  academic: {
    exams: number;
    averageGrade: number;
    subjects: string[];
  };
  financial: {
    totalFees: number;
    paidFees: number;
    outstanding: number;
  };
}

export interface AttendanceReport {
  classId?: number;
  studentId?: number;
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
  };
  details: Attendance[];
}

export interface AcademicReport {
  classId?: number;
  studentId?: number;
  examId?: number;
  summary: {
    totalExams: number;
    averageGrade: number;
    highestGrade: string;
    lowestGrade: string;
  };
  results: ExamResult[];
}

export interface FinancialReport {
  classId?: number;
  studentId?: number;
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalFees: number;
    collectedFees: number;
    outstandingFees: number;
    collectionRate: number;
  };
  payments: FeePayment[];
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface StudentForm {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  studentId: string;
  currentClass: string;
  section?: string;
  rollNumber?: number;
  admissionDate: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  fatherName: string;
  motherName: string;
}

export interface ExamForm {
  name: string;
  subjectId: number;
  classId: number;
  examDate: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  examType: 'mid_term' | 'final' | 'quiz' | 'assignment';
  description?: string;
}

export interface ExamResultForm {
  studentId: number;
  obtainedMarks: number;
  grade?: string;
  remarks?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Notification Types
export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: number;
} 