# Employee Onboarding Management System - Frontend

## 📋 Overview

This is a React frontend application for the Employee Onboarding Management System. It provides a modern, responsive interface for managing employee onboarding processes with real-time tracking and notifications.

## 🚀 Features

- **Dashboard Overview**: KPI tracking and visual analytics
- **Employee Management**: Add and track new employee arrivals
- **Checklist Management**: Create and manage onboarding tasks
- **Progress Tracking**: Real-time onboarding progress monitoring
- **Notification System**: Automated notifications with PDF generation
- **Planning Generator**: Weekly/monthly onboarding planning
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **Mantine** UI components
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Table** for data tables

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── features/           # Redux slices and state management
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Layout components
│   ├── pages/              # Page components
│   ├── store/              # Redux store configuration
│   ├── styles/             # Global styles and CSS
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🎨 Key Components

### Dashboard
- **KPI Panel**: Real-time metrics and statistics
- **Charts**: Visual analytics with Recharts
- **Filter Bar**: Dynamic filtering options
- **Integrations Table**: Employee onboarding overview

### Employee Management
- **New Employee Modal**: Comprehensive employee creation form
- **Employee Cards**: Visual employee status tracking
- **Progress Tracking**: Step-by-step onboarding progress

### Checklist System
- **Checklist Manager**: Create and manage onboarding tasks
- **Department Tabs**: Organized by HR, IT, and Security
- **Task Status**: Real-time task completion tracking

### Notification System
- **Notification Manager**: Automated notification creation
- **PDF Generation**: Automatic onboarding matrix generation
- **Email Integration**: Multi-recipient notification system

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Onboarding Solution
```

### API Integration
The frontend is configured to work with the Spring Boot backend:
- Default API URL: `http://localhost:8080/api`
- CORS enabled for development
- Automatic error handling and loading states

## 🎯 Features Overview

### Dashboard
- Real-time KPI tracking
- Interactive charts and analytics
- Employee status overview
- Quick action buttons

### Employee Onboarding
- Multi-step employee creation form
- Department-specific task assignment
- Progress tracking with visual indicators
- Status management workflow

### Checklist Management
- Create custom onboarding tasks
- Department-based organization
- Mandatory vs optional task classification
- Duration estimation and tracking

### Notification System
- Automated notification generation
- PDF matrix creation
- Multi-department recipient management
- Notification history and status tracking

### Planning Generator
- Weekly/monthly planning views
- Department-specific task filtering
- Export functionality
- Resource allocation overview

## 🎨 Design System

### Colors
- **Primary**: Blue tones for main actions
- **Secondary**: Slate for neutral elements
- **Success**: Green for completed states
- **Warning**: Orange for in-progress states
- **Error**: Red for overdue/error states

### Typography
- **Font**: Inter variable font
- **Headings**: Bold weights for hierarchy
- **Body**: Regular weight for readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent sizing and hover states
- **Forms**: Clear labels and validation
- **Tables**: Sortable with pagination
- **Modals**: Smooth animations and backdrop

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run linting
npm run lint
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
The application is configured for easy Netlify deployment:
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🔗 Backend Integration

This frontend is designed to work with the Spring Boot backend:
- **API Base URL**: Configurable via environment variables
- **Authentication**: Ready for JWT integration
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Smooth loading indicators

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style and patterns
4. Test your changes thoroughly
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the component documentation
- Review the Redux state structure
- Test API endpoints with the backend
- Check browser console for errors

---

**Happy Coding! 🎉**