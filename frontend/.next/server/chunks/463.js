"use strict";
exports.id = 463;
exports.ids = [463];
exports.modules = {

/***/ 1463:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "H": () => (/* binding */ AuthProvider),
/* harmony export */   "V": () => (/* binding */ AuthContext)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8469);



const AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({
    user: null,
    login: async ()=>{},
    logout: ()=>{}
});
const AuthProvider = ({ children  })=>{
    const { 0: user , 1: setUser  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const token = localStorage.getItem("token");
        if (token) setUser({
            role: JSON.parse(atob(token.split(".")[1])).role
        });
    }, []);
    const login = async ({ email , password  })=>{
        const { data  } = await _services_api__WEBPACK_IMPORTED_MODULE_2__/* ["default"].post */ .ZP.post("/auth/login", {
            email,
            password
        });
        localStorage.setItem("token", data.token);
        setUser({
            role: data.role
        });
    };
    const logout = ()=>{
        localStorage.removeItem("token");
        setUser(null);
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(AuthContext.Provider, {
        value: {
            user,
            login,
            logout
        },
        children: children
    });
};


/***/ })

};
;