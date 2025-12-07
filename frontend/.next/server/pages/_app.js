"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 5028:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ ui_NotificationContainer)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "styled-jsx/style"
var style_ = __webpack_require__(9816);
var style_default = /*#__PURE__*/__webpack_require__.n(style_);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./src/contexts/NotificationContext.tsx
var NotificationContext = __webpack_require__(8119);
;// CONCATENATED MODULE: ./src/components/ui/NotificationToast.tsx


const NotificationToast = ({ notification , onClose , autoClose =true , duration =5000 ,  })=>{
    (0,external_react_.useEffect)(()=>{
        if (autoClose && notification.type !== "error") {
            const timer = setTimeout(()=>{
                onClose();
            }, duration);
            return ()=>clearTimeout(timer);
        }
    }, [
        autoClose,
        duration,
        notification.type,
        onClose
    ]);
    const getIcon = ()=>{
        switch(notification.type){
            case "success":
                return /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                    className: "w-5 h-5 text-green-400",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                        fillRule: "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                        clipRule: "evenodd"
                    })
                });
            case "error":
                return /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                    className: "w-5 h-5 text-red-400",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                        fillRule: "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                        clipRule: "evenodd"
                    })
                });
            case "warning":
                return /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                    className: "w-5 h-5 text-yellow-400",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                        fillRule: "evenodd",
                        d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                        clipRule: "evenodd"
                    })
                });
            case "info":
                return /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                    className: "w-5 h-5 text-blue-400",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                        fillRule: "evenodd",
                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                        clipRule: "evenodd"
                    })
                });
            default:
                return null;
        }
    };
    const getBackgroundColor = ()=>{
        switch(notification.type){
            case "success":
                return "bg-green-50 border-green-200";
            case "error":
                return "bg-red-50 border-red-200";
            case "warning":
                return "bg-yellow-50 border-yellow-200";
            case "info":
                return "bg-blue-50 border-blue-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };
    const getTextColor = ()=>{
        switch(notification.type){
            case "success":
                return "text-green-800";
            case "error":
                return "text-red-800";
            case "warning":
                return "text-yellow-800";
            case "info":
                return "text-blue-800";
            default:
                return "text-gray-800";
        }
    };
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: `max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto border ${getBackgroundColor()} overflow-hidden`,
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: "p-4",
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex items-start",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "flex-shrink-0",
                        children: getIcon()
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "ml-3 w-0 flex-1 pt-0.5",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: `text-sm font-medium ${getTextColor()}`,
                                children: notification.title
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: "mt-1 text-sm text-gray-600",
                                children: notification.message
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: "mt-1 text-xs text-gray-500",
                                children: new Date(notification.timestamp).toLocaleTimeString()
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "ml-4 flex-shrink-0 flex",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                            className: "bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                            onClick: onClose,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                    className: "sr-only",
                                    children: "Close"
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                                    className: "h-5 w-5",
                                    viewBox: "0 0 20 20",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                        fillRule: "evenodd",
                                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                        clipRule: "evenodd"
                                    })
                                })
                            ]
                        })
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const ui_NotificationToast = (NotificationToast);

;// CONCATENATED MODULE: ./src/components/ui/NotificationContainer.tsx





const NotificationContainer = ()=>{
    const { notifications , removeNotification  } = (0,NotificationContext/* useNotifications */.z)();
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "jsx-3f84bbf53b13d0df" + " " + "fixed top-4 right-4 z-50 space-y-4",
        children: [
            notifications.map((notification)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                    style: {
                        animation: "slideInRight 0.3s ease-out"
                    },
                    className: "jsx-3f84bbf53b13d0df" + " " + "transform transition-all duration-300 ease-in-out",
                    children: /*#__PURE__*/ jsx_runtime_.jsx(ui_NotificationToast, {
                        notification: notification,
                        onClose: ()=>removeNotification(notification.id)
                    })
                }, notification.id)),
            jsx_runtime_.jsx((style_default()), {
                id: "3f84bbf53b13d0df",
                children: "@-webkit-keyframes slideInRight{from{-webkit-transform:translateX(100%);transform:translateX(100%);opacity:0}to{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}}@-moz-keyframes slideInRight{from{-moz-transform:translateX(100%);transform:translateX(100%);opacity:0}to{-moz-transform:translateX(0);transform:translateX(0);opacity:1}}@-o-keyframes slideInRight{from{-o-transform:translateX(100%);transform:translateX(100%);opacity:0}to{-o-transform:translateX(0);transform:translateX(0);opacity:1}}@keyframes slideInRight{from{-webkit-transform:translateX(100%);-moz-transform:translateX(100%);-o-transform:translateX(100%);transform:translateX(100%);opacity:0}to{-webkit-transform:translateX(0);-moz-transform:translateX(0);-o-transform:translateX(0);transform:translateX(0);opacity:1}}"
            })
        ]
    });
};
/* harmony default export */ const ui_NotificationContainer = (NotificationContainer);


/***/ }),

/***/ 7527:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ layouts_MainLayout)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "styled-jsx/style"
var style_ = __webpack_require__(9816);
var style_default = /*#__PURE__*/__webpack_require__.n(style_);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: external "react-icons/fa"
var fa_ = __webpack_require__(6290);
;// CONCATENATED MODULE: ./src/components/Sidebar.tsx





const Sidebar = ({ isOpen , onToggle  })=>{
    const router = (0,router_.useRouter)();
    const navigationItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaTachometerAlt, {
                className: "nav-icon"
            })
        },
        {
            label: "Student Management",
            path: "/students",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaUserGraduate, {
                className: "nav-icon"
            })
        },
        {
            label: "Teacher Management",
            path: "/teachers",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaChalkboardTeacher, {
                className: "nav-icon"
            })
        },
        {
            label: "Class Management",
            path: "/admin/classes",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaUsers, {
                className: "nav-icon"
            })
        },
        {
            label: "Attendance",
            path: "/attendance",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaUserCheck, {
                className: "nav-icon"
            })
        },
        {
            label: "Attendance Reports",
            path: "/attendance-reports",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaFileAlt, {
                className: "nav-icon"
            })
        },
        {
            label: "Accounts",
            path: "/accounts",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaMoneyBillWave, {
                className: "nav-icon"
            })
        },
        {
            label: "Fee Management",
            path: "/fee-management",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaMoneyBillWave, {
                className: "nav-icon"
            })
        },
        {
            label: "Library Management",
            path: "/library",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaBook, {
                className: "nav-icon"
            })
        },
        {
            label: "Examination",
            path: "/admin/exams",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaClipboardList, {
                className: "nav-icon"
            })
        },
        {
            label: "Reports",
            path: "/admin/reports",
            icon: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaChartBar, {
                className: "nav-icon"
            })
        }
    ];
    const isActiveRoute = (path)=>{
        if (path === "/dashboard") {
            return router.pathname === "/dashboard" || router.pathname === "/";
        }
        return router.pathname.startsWith(path);
    };
    const handleLogout = ()=>{
        localStorage.removeItem("token");
        router.push("/login");
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            isOpen && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                onClick: onToggle,
                className: "jsx-bca23804d33d5a02" + " " + "sidebar-overlay"
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("aside", {
                className: "jsx-bca23804d33d5a02" + " " + `sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "jsx-bca23804d33d5a02" + " " + "sidebar-header",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "jsx-bca23804d33d5a02" + " " + "sidebar-logo",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaBookOpen, {
                                        className: "logo-icon"
                                    }),
                                    isOpen && /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        className: "jsx-bca23804d33d5a02" + " " + "logo-text",
                                        children: "School MS"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                onClick: onToggle,
                                "aria-label": "Toggle Sidebar",
                                className: "jsx-bca23804d33d5a02" + " " + "sidebar-toggle-btn d-none d-lg-block",
                                children: isOpen ? /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaChevronLeft, {}) : /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaChevronRight, {})
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                onClick: onToggle,
                                "aria-label": "Close Sidebar",
                                className: "jsx-bca23804d33d5a02" + " " + "sidebar-close-btn d-lg-none",
                                children: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaTimes, {})
                            })
                        ]
                    }),
                    isOpen && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "jsx-bca23804d33d5a02" + " " + "sidebar-user",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaUserCircle, {
                                className: "user-avatar"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "jsx-bca23804d33d5a02" + " " + "user-info",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "jsx-bca23804d33d5a02" + " " + "user-name",
                                        children: "Admin User"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "jsx-bca23804d33d5a02" + " " + "user-role",
                                        children: "Administrator"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("nav", {
                        className: "jsx-bca23804d33d5a02" + " " + "sidebar-nav",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                            className: "jsx-bca23804d33d5a02" + " " + "nav-list",
                            children: navigationItems.map((item)=>{
                                const active = isActiveRoute(item.path);
                                return /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                    className: "jsx-bca23804d33d5a02" + " " + "nav-item",
                                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("a", {
                                        title: !isOpen ? item.label : "",
                                        onClick: (e)=>{
                                            e.preventDefault();
                                            router.push(item.path);
                                        },
                                        style: {
                                            cursor: "pointer"
                                        },
                                        className: "jsx-bca23804d33d5a02" + " " + `nav-link ${active ? "active" : ""}`,
                                        children: [
                                            item.icon,
                                            isOpen && /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                                className: "jsx-bca23804d33d5a02" + " " + "nav-label",
                                                children: item.label
                                            }),
                                            active && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                className: "jsx-bca23804d33d5a02" + " " + "active-indicator"
                                            })
                                        ]
                                    })
                                }, item.path);
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "jsx-bca23804d33d5a02" + " " + "sidebar-footer",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                            onClick: handleLogout,
                            title: !isOpen ? "Logout" : "",
                            className: "jsx-bca23804d33d5a02" + " " + "logout-btn",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaSignOutAlt, {
                                    className: "nav-icon"
                                }),
                                isOpen && /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                    className: "jsx-bca23804d33d5a02",
                                    children: "Logout"
                                })
                            ]
                        })
                    })
                ]
            }),
            jsx_runtime_.jsx((style_default()), {
                id: "bca23804d33d5a02",
                children: ".sidebar-overlay.jsx-bca23804d33d5a02{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:1040;display:none}@media(max-width:991.98px){.sidebar-overlay.jsx-bca23804d33d5a02{display:block}}.sidebar.jsx-bca23804d33d5a02{position:fixed;top:0;left:0;bottom:0;background:-webkit-linear-gradient(top,#1e3a8a 0%,#1e40af 100%);background:-moz-linear-gradient(top,#1e3a8a 0%,#1e40af 100%);background:-o-linear-gradient(top,#1e3a8a 0%,#1e40af 100%);background:linear-gradient(180deg,#1e3a8a 0%,#1e40af 100%);color:white;z-index:1050;-webkit-transition:all.3s ease;-moz-transition:all.3s ease;-o-transition:all.3s ease;transition:all.3s ease;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-shadow:2px 0 10px rgba(0,0,0,.1);-moz-box-shadow:2px 0 10px rgba(0,0,0,.1);box-shadow:2px 0 10px rgba(0,0,0,.1)}.sidebar-open.jsx-bca23804d33d5a02{width:260px}.sidebar-closed.jsx-bca23804d33d5a02{width:80px}@media(max-width:991.98px){.sidebar.jsx-bca23804d33d5a02{-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);-ms-transform:translateX(-100%);-o-transform:translateX(-100%);transform:translateX(-100%)}.sidebar-open.jsx-bca23804d33d5a02{-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);-o-transform:translateX(0);transform:translateX(0);width:260px}}.sidebar-header.jsx-bca23804d33d5a02{padding:1.5rem 1rem;border-bottom:1px solid rgba(255,255,255,.1);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;min-height:70px}.sidebar-logo.jsx-bca23804d33d5a02{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;gap:.75rem;font-weight:700;font-size:1.25rem}.logo-icon.jsx-bca23804d33d5a02{font-size:1.75rem;color:#60a5fa}.logo-text.jsx-bca23804d33d5a02{white-space:nowrap}.sidebar-toggle-btn.jsx-bca23804d33d5a02,.sidebar-close-btn.jsx-bca23804d33d5a02{background:rgba(255,255,255,.1);border:none;color:white;width:32px;height:32px;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;cursor:pointer;-webkit-transition:all.2s;-moz-transition:all.2s;-o-transition:all.2s;transition:all.2s}.sidebar-toggle-btn.jsx-bca23804d33d5a02:hover,.sidebar-close-btn.jsx-bca23804d33d5a02:hover{background:rgba(255,255,255,.2)}.sidebar-user.jsx-bca23804d33d5a02{padding:1.25rem 1rem;border-bottom:1px solid rgba(255,255,255,.1);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;gap:.75rem}.user-avatar.jsx-bca23804d33d5a02{font-size:2.5rem;color:#60a5fa;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.user-info.jsx-bca23804d33d5a02{overflow:hidden}.user-name.jsx-bca23804d33d5a02{font-weight:600;font-size:.95rem;white-space:nowrap;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis}.user-role.jsx-bca23804d33d5a02{font-size:.8rem;color:rgba(255,255,255,.7);white-space:nowrap;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis}.sidebar-nav.jsx-bca23804d33d5a02{-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;overflow-y:auto;overflow-x:hidden;padding:1rem 0}.sidebar-nav.jsx-bca23804d33d5a02::-webkit-scrollbar{width:6px}.sidebar-nav.jsx-bca23804d33d5a02::-webkit-scrollbar-track{background:rgba(255,255,255,.05)}.sidebar-nav.jsx-bca23804d33d5a02::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px}.nav-list.jsx-bca23804d33d5a02{list-style:none;padding:0;margin:0}.nav-item.jsx-bca23804d33d5a02{margin:.25rem .5rem}.nav-link.jsx-bca23804d33d5a02{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;padding:.875rem 1rem;color:rgba(255,255,255,.8);text-decoration:none;-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px;-webkit-transition:all.2s;-moz-transition:all.2s;-o-transition:all.2s;transition:all.2s;position:relative;gap:.875rem;font-size:.95rem}.sidebar-closed.jsx-bca23804d33d5a02 .nav-link.jsx-bca23804d33d5a02{-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.nav-link.jsx-bca23804d33d5a02:hover{background:rgba(255,255,255,.1);color:white;-webkit-transform:translateX(2px);-moz-transform:translateX(2px);-ms-transform:translateX(2px);-o-transform:translateX(2px);transform:translateX(2px)}.nav-link.active.jsx-bca23804d33d5a02{background:rgba(96,165,250,.2);color:white;font-weight:600}.nav-icon.jsx-bca23804d33d5a02{font-size:1.25rem;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.nav-label.jsx-bca23804d33d5a02{white-space:nowrap;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis}.active-indicator.jsx-bca23804d33d5a02{position:absolute;left:0;top:50%;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);-o-transform:translateY(-50%);transform:translateY(-50%);width:4px;height:70%;background:#60a5fa;-webkit-border-radius:0 4px 4px 0;-moz-border-radius:0 4px 4px 0;border-radius:0 4px 4px 0}.sidebar-footer.jsx-bca23804d33d5a02{padding:1rem;border-top:1px solid rgba(255,255,255,.1)}.logout-btn.jsx-bca23804d33d5a02{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;gap:.875rem;width:100%;padding:.875rem 1rem;background:rgba(239,68,68,.2);border:none;color:white;-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px;cursor:pointer;-webkit-transition:all.2s;-moz-transition:all.2s;-o-transition:all.2s;transition:all.2s;font-size:.95rem}.sidebar-closed.jsx-bca23804d33d5a02 .logout-btn.jsx-bca23804d33d5a02{-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.logout-btn.jsx-bca23804d33d5a02:hover{background:rgba(239,68,68,.3);-webkit-transform:translateX(2px);-moz-transform:translateX(2px);-ms-transform:translateX(2px);-o-transform:translateX(2px);transform:translateX(2px)}"
            })
        ]
    });
};
/* harmony default export */ const components_Sidebar = (Sidebar);

;// CONCATENATED MODULE: ./src/layouts/MainLayout.tsx






const MainLayout = ({ children  })=>{
    const { 0: sidebarOpen , 1: setSidebarOpen  } = (0,external_react_.useState)(true);
    const router = (0,router_.useRouter)();
    // Close sidebar on mobile by default
    (0,external_react_.useEffect)(()=>{
        const handleResize = ()=>{
            if (window.innerWidth < 992) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        // Set initial state
        handleResize();
        // Listen for resize events
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);
    // Close sidebar on route change on mobile
    (0,external_react_.useEffect)(()=>{
        const handleRouteChange = ()=>{
            if (window.innerWidth < 992) {
                setSidebarOpen(false);
            }
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return ()=>{
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [
        router.events
    ]);
    const toggleSidebar = ()=>{
        setSidebarOpen(!sidebarOpen);
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "jsx-72c933974c47cabc" + " " + "main-layout",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(components_Sidebar, {
                isOpen: sidebarOpen,
                onToggle: toggleSidebar
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "jsx-72c933974c47cabc" + " " + `main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "jsx-72c933974c47cabc" + " " + "top-bar d-lg-none",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                onClick: toggleSidebar,
                                className: "jsx-72c933974c47cabc" + " " + "menu-btn",
                                children: /*#__PURE__*/ jsx_runtime_.jsx(fa_.FaBars, {})
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "jsx-72c933974c47cabc" + " " + "top-bar-title",
                                children: "School Management System"
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "jsx-72c933974c47cabc" + " " + "content-wrapper",
                        children: children
                    })
                ]
            }),
            jsx_runtime_.jsx((style_default()), {
                id: "72c933974c47cabc",
                children: ".main-layout.jsx-72c933974c47cabc{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;min-height:100vh;background:#f8f9fa}.main-content.jsx-72c933974c47cabc{-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-transition:margin-left.3s ease;-moz-transition:margin-left.3s ease;-o-transition:margin-left.3s ease;transition:margin-left.3s ease;min-height:100vh}.main-content.sidebar-open.jsx-72c933974c47cabc{margin-left:260px}.main-content.sidebar-closed.jsx-72c933974c47cabc{margin-left:80px}@media(max-width:991.98px){.main-content.sidebar-open.jsx-72c933974c47cabc,.main-content.sidebar-closed.jsx-72c933974c47cabc{margin-left:0}}.top-bar.jsx-72c933974c47cabc{position:-webkit-sticky;position:sticky;top:0;z-index:1030;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;padding:1rem;background:white;border-bottom:1px solid#dee2e6;-webkit-box-shadow:0 2px 4px rgba(0,0,0,.05);-moz-box-shadow:0 2px 4px rgba(0,0,0,.05);box-shadow:0 2px 4px rgba(0,0,0,.05)}.menu-btn.jsx-72c933974c47cabc{background:none;border:none;font-size:1.5rem;color:#1e3a8a;cursor:pointer;padding:.5rem;margin-right:1rem;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.menu-btn.jsx-72c933974c47cabc:hover{color:#1e40af}.top-bar-title.jsx-72c933974c47cabc{font-weight:600;font-size:1.1rem;color:#1e3a8a}.content-wrapper.jsx-72c933974c47cabc{-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;padding:1.5rem;max-width:100%;overflow-x:hidden}@media(min-width:768px){.content-wrapper.jsx-72c933974c47cabc{padding:2rem}}@media(min-width:1200px){.content-wrapper.jsx-72c933974c47cabc{padding:2.5rem}}"
            })
        ]
    });
};
/* harmony default export */ const layouts_MainLayout = (MainLayout);


/***/ }),

/***/ 2957:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1463);
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8119);
/* harmony import */ var _components_ui_NotificationContainer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5028);
/* harmony import */ var _layouts_MainLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7527);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__]);
_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];








function App({ Component , pageProps  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    // Pages that should NOT use the MainLayout (login, register, landing page)
    const noLayoutPages = [
        "/",
        "/login",
        "/register"
    ];
    const useLayout = !noLayoutPages.includes(router.pathname);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__/* .AuthProvider */ .H, {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_3__/* .NotificationProvider */ .J, {
            children: [
                useLayout ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_layouts_MainLayout__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                        ...pageProps
                    })
                }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                    ...pageProps
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_NotificationContainer__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {})
            ]
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 6290:
/***/ ((module) => {

module.exports = require("react-icons/fa");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 9816:
/***/ ((module) => {

module.exports = require("styled-jsx/style");

/***/ }),

/***/ 9648:
/***/ ((module) => {

module.exports = import("axios");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [469,119,463], () => (__webpack_exec__(2957)));
module.exports = __webpack_exports__;

})();