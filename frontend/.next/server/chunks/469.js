"use strict";
exports.id = 469;
exports.ids = [469];
exports.modules = {

/***/ 8469:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ft": () => (/* binding */ classAPI),
/* harmony export */   "Ix": () => (/* binding */ subjectAPI),
/* harmony export */   "T6": () => (/* binding */ examAPI),
/* harmony export */   "Vo": () => (/* binding */ reportAPI),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "t7": () => (/* binding */ studentAPI),
/* harmony export */   "vD": () => (/* binding */ dashboardAPI)
/* harmony export */ });
/* unused harmony exports authAPI, staffAPI, attendanceAPI, feeAPI, permissionAPI */
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2167);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

const api = axios__WEBPACK_IMPORTED_MODULE_0___default().create({
    baseURL: "http://localhost:4000/api"
});
// attach token if present
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Auth API
const authAPI = {
    login: (credentials)=>api.post("/auth/login", credentials),
    register: (userData)=>api.post("/auth/register", userData),
    logout: ()=>api.post("/auth/logout"),
    getCurrentUser: ()=>api.get("/auth/me")
};
// Student API
const studentAPI = {
    getAll: ()=>api.get("/students"),
    getById: (id)=>api.get(`/students/${id}`),
    create: (data)=>api.post("/students", data),
    update: (id, data)=>api.put(`/students/${id}`, data),
    delete: (id)=>api.delete(`/students/${id}`)
};
// Staff API
const staffAPI = {
    getAll: ()=>api.get("/staff"),
    getById: (id)=>api.get(`/staff/${id}`),
    create: (data)=>api.post("/staff", data),
    update: (id, data)=>api.put(`/staff/${id}`, data),
    delete: (id)=>api.delete(`/staff/${id}`)
};
// Class API
const classAPI = {
    getAll: ()=>api.get("/classes"),
    getById: (id)=>api.get(`/classes/${id}`),
    create: (data)=>api.post("/classes", data),
    update: (id, data)=>api.put(`/classes/${id}`, data),
    delete: (id)=>api.delete(`/classes/${id}`)
};
// Attendance API
const attendanceAPI = {
    getAll: ()=>api.get("/attendance"),
    getByStudent: (studentId)=>api.get(`/attendance/student/${studentId}`),
    getByClass: (classId)=>api.get(`/attendance/class/${classId}`),
    create: (data)=>api.post("/attendance", data),
    update: (id, data)=>api.put(`/attendance/${id}`, data)
};
// Subject API
const subjectAPI = {
    getAll: ()=>api.get("/subjects"),
    getById: (id)=>api.get(`/subjects/${id}`),
    create: (data)=>api.post("/subjects", data),
    update: (id, data)=>api.put(`/subjects/${id}`, data),
    delete: (id)=>api.delete(`/subjects/${id}`)
};
// Fee API
const feeAPI = {
    getAll: ()=>api.get("/fees"),
    getById: (id)=>api.get(`/fees/${id}`),
    create: (data)=>api.post("/fees", data),
    update: (id, data)=>api.put(`/fees/${id}`, data),
    delete: (id)=>api.delete(`/fees/${id}`),
    recordPayment: (feeId, data)=>api.post(`/fees/${feeId}/payments`, data),
    getPayments: (feeId)=>api.get(`/fees/${feeId}/payments`)
};
// Exam API
const examAPI = {
    getAll: ()=>api.get("/exams"),
    getById: (id)=>api.get(`/exams/${id}`),
    create: (data)=>api.post("/exams", data),
    update: (id, data)=>api.put(`/exams/${id}`, data),
    delete: (id)=>api.delete(`/exams/${id}`),
    addResult: (examId, data)=>api.post(`/exams/${examId}/results`, data),
    getResults: (examId)=>api.get(`/exams/${examId}/results`)
};
// Report API
const reportAPI = {
    getStudents: (params)=>api.get("/reports/students", {
            params
        }),
    getAttendance: (params)=>api.get("/reports/attendance", {
            params
        }),
    getAcademic: (params)=>api.get("/reports/academic", {
            params
        }),
    getFinancial: (params)=>api.get("/reports/financial", {
            params
        }),
    getCustom: (params)=>api.get("/reports/custom", {
            params
        })
};
// Dashboard API
const dashboardAPI = {
    getAdmin: ()=>api.get("/dashboard/admin"),
    getTeacher: ()=>api.get("/dashboard/teacher"),
    getStudent: ()=>api.get("/dashboard/student"),
    getParent: ()=>api.get("/dashboard/parent")
};
// Permission API
const permissionAPI = {
    getAll: ()=>api.get("/permissions"),
    assignToUser: (userId, permissionIds)=>api.post(`/users/${userId}/permissions`, {
            permissionIds
        }),
    getUserPermissions: (userId)=>api.get(`/users/${userId}/permissions`)
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);


/***/ })

};
;