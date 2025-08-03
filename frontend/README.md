# School Management System - Frontend

A modern, responsive React/Next.js frontend for the School Management System with comprehensive features for managing all aspects of school operations.

## 🚀 Features

### 📊 Enhanced Dashboard
- **Role-based Dashboards**: Different views for Admin, Teacher, Student, and Parent
- **Real-time Statistics**: Live updates of key metrics
- **Quick Actions**: Easy access to common tasks
- **Recent Activity**: Latest updates and notifications
- **Analytics Charts**: Visual representation of data trends

### 📝 Exam Management
- **Complete CRUD Operations**: Create, read, update, and delete exams
- **Exam Scheduling**: Set exam dates, times, and durations
- **Result Management**: Add and manage exam results
- **Grade Calculation**: Automatic grade calculation based on marks
- **Bulk Operations**: Manage multiple exams and results efficiently

### 📈 Comprehensive Reporting
- **Student Reports**: Individual student performance and attendance
- **Attendance Reports**: Class and individual attendance tracking
- **Academic Reports**: Exam results and performance analytics
- **Financial Reports**: Fee collection and outstanding payments
- **Custom Filters**: Filter reports by class, student, date range
- **Export Functionality**: Export reports to PDF/Excel

### 🔔 Real-time Notifications
- **Toast Notifications**: Non-intrusive notification system
- **Multiple Types**: Success, error, warning, and info notifications
- **Auto-dismiss**: Automatic removal of non-critical notifications
- **Persistent Storage**: Notifications saved in localStorage
- **Real-time Updates**: Instant feedback for user actions

### 🎨 Modern UI Components
- **Reusable Components**: Button, Input, Select, Modal, Table
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Comprehensive error states and messages
- **Accessibility**: ARIA labels and keyboard navigation

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for different user types
- **Protected Routes**: Automatic route protection based on roles
- **Session Management**: Secure session handling

## 🛠️ Technology Stack

- **Framework**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS 3+
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT with localStorage
- **Notifications**: Custom notification system
- **Icons**: Heroicons (SVG)
- **Charts**: Custom chart components

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── NotificationToast.tsx
│   │   └── NotificationContainer.tsx
│   ├── dashboard/             # Dashboard components
│   │   └── DashboardStats.tsx
│   └── Navigation.tsx
├── contexts/
│   ├── AuthContext.tsx        # Authentication context
│   └── NotificationContext.tsx # Notification management
├── hooks/
│   └── useNotification.ts     # Custom notification hook
├── layouts/
│   └── RoleLayout.tsx         # Role-based layout wrapper
├── pages/
│   ├── admin/                 # Admin pages
│   │   ├── dashboard.tsx      # Enhanced admin dashboard
│   │   ├── exams.tsx          # Exam management
│   │   ├── exams/[id]/results.tsx # Exam results
│   │   └── reports.tsx        # Comprehensive reports
│   ├── _app.tsx              # App wrapper with providers
│   ├── index.tsx             # Landing page
│   ├── login.tsx             # Login page
│   └── register.tsx          # Registration page
├── services/
│   └── api.ts                # API service with all endpoints
├── styles/
│   └── globals.css           # Global styles
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/                    # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on port 4000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-mgmt/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_NAME=School Management System
```

### API Configuration
The API service is configured in `src/services/api.ts` with:
- Base URL configuration
- JWT token interceptor
- Error handling
- All API endpoints for the system

## 🎯 Key Features Implementation

### 1. Enhanced Dashboard
The admin dashboard provides:
- **Statistics Cards**: Total students, staff, classes, exams
- **Quick Actions**: Add student, staff, create exam, view reports
- **Recent Activity**: Latest students, staff, and upcoming exams
- **Fee Collection Chart**: Visual representation of fee trends

### 2. Exam Management
Complete exam management system:
- **Exam Creation**: Form with validation and error handling
- **Exam Listing**: Table with search and filter capabilities
- **Result Management**: Add/edit exam results with grade calculation
- **Bulk Operations**: Manage multiple exams efficiently

### 3. Reporting System
Comprehensive reporting with:
- **Multiple Report Types**: Student, attendance, academic, financial
- **Advanced Filtering**: By class, student, date range
- **Summary Statistics**: Key metrics for each report type
- **Export Functionality**: PDF/Excel export capabilities

### 4. Real-time Notifications
Modern notification system:
- **Toast Notifications**: Non-intrusive popup notifications
- **Multiple Types**: Success, error, warning, info
- **Auto-dismiss**: Automatic removal of non-critical notifications
- **Persistent Storage**: Notifications saved across sessions

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Cross-browser compatibility

### Loading States
- Skeleton loaders for content
- Loading spinners for actions
- Progressive loading for large datasets

### Error Handling
- User-friendly error messages
- Graceful error recovery
- Network error handling
- Form validation feedback

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode support

## 🔐 Security Features

### Authentication
- JWT token management
- Automatic token refresh
- Secure token storage
- Session timeout handling

### Authorization
- Role-based access control
- Route protection
- Component-level permissions
- API endpoint security

## 📱 Mobile Support

The application is fully responsive and optimized for:
- **Mobile Devices**: Smartphones and tablets
- **Touch Interfaces**: Touch-friendly buttons and controls
- **Offline Capability**: Basic offline functionality
- **Progressive Web App**: PWA features for mobile users

## 🚀 Performance Optimization

### Code Splitting
- Automatic route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Caching
- API response caching
- Static asset optimization
- Browser caching strategies

### Bundle Optimization
- Tree shaking for unused code
- Minification and compression
- Image optimization

## 🧪 Testing

### Unit Testing
- Component testing with React Testing Library
- Hook testing
- Utility function testing

### Integration Testing
- API integration testing
- User flow testing
- Cross-browser testing

### E2E Testing
- End-to-end user journey testing
- Critical path testing
- Performance testing

## 📈 Future Enhancements

### Planned Features
- **Real-time Chat**: Teacher-student communication
- **File Upload**: Document and image uploads
- **Calendar Integration**: Google Calendar sync
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization

### Performance Improvements
- **Server-side Rendering**: Improved SEO and performance
- **CDN Integration**: Global content delivery
- **Database Optimization**: Query optimization
- **Caching Strategy**: Redis caching implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS** 