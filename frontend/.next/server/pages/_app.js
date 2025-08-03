"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 6162:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ App)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(1463);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
;// CONCATENATED MODULE: ./src/contexts/NotificationContext.tsx


const NotificationContext = /*#__PURE__*/ (0,external_react_.createContext)(undefined);
const NotificationProvider = ({ children  })=>{
    const { 0: notifications , 1: setNotifications  } = (0,external_react_.useState)([]);
    // Load notifications from localStorage on mount
    (0,external_react_.useEffect)(()=>{
        const savedNotifications = localStorage.getItem("notifications");
        if (savedNotifications) {
            try {
                setNotifications(JSON.parse(savedNotifications));
            } catch (error) {
                console.error("Error loading notifications:", error);
            }
        }
    }, []);
    // Save notifications to localStorage whenever they change
    (0,external_react_.useEffect)(()=>{
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [
        notifications
    ]);
    const addNotification = (notification)=>{
        const newNotification = {
            ...notification,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications((prev)=>[
                newNotification,
                ...prev
            ]);
        // Auto-remove success notifications after 5 seconds
        if (notification.type === "success") {
            setTimeout(()=>{
                removeNotification(newNotification.id);
            }, 5000);
        }
    };
    const markAsRead = (id)=>{
        setNotifications((prev)=>prev.map((notification)=>notification.id === id ? {
                    ...notification,
                    read: true
                } : notification));
    };
    const markAllAsRead = ()=>{
        setNotifications((prev)=>prev.map((notification)=>({
                    ...notification,
                    read: true
                })));
    };
    const removeNotification = (id)=>{
        setNotifications((prev)=>prev.filter((notification)=>notification.id !== id));
    };
    const clearAll = ()=>{
        setNotifications([]);
    };
    const unreadCount = notifications.filter((notification)=>!notification.read).length;
    const value = {
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        unreadCount
    };
    return /*#__PURE__*/ jsx_runtime_.jsx(NotificationContext.Provider, {
        value: value,
        children: children
    });
};
const useNotifications = ()=>{
    const context = (0,external_react_.useContext)(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};

;// CONCATENATED MODULE: external "styled-jsx/style"
const style_namespaceObject = require("styled-jsx/style");
var style_default = /*#__PURE__*/__webpack_require__.n(style_namespaceObject);
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
    const { notifications , removeNotification  } = useNotifications();
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

;// CONCATENATED MODULE: ./src/pages/_app.tsx





function App({ Component , pageProps  }) {
    return /*#__PURE__*/ jsx_runtime_.jsx(AuthContext/* AuthProvider */.H, {
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(NotificationProvider, {
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(Component, {
                    ...pageProps
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(ui_NotificationContainer, {})
            ]
        })
    });
}


/***/ }),

/***/ 2167:
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [469,463], () => (__webpack_exec__(6162)));
module.exports = __webpack_exports__;

})();