import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Auth
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Admin Pages
import ShiftManagement from './pages/admin/ShiftManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import TimeOffManagement from './pages/admin/TimeOffManagement';
import Analytics from './pages/admin/Analytics';
import Announcements from './pages/admin/Announcements';
import FileManagement from './pages/admin/FileManagement';
import Settings from './pages/admin/Settings';
import TeamCollaboration from './pages/admin/TeamCollaboration';

// Regular pages
import Dashboard from './pages/Dashboard';
import Shifts from './pages/Shifts';
import Team from './pages/Team';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Redirect route for old URLs */}
              <Route path="/employee/team" element={<Navigate to="/dashboard/team" replace />} />
              
              {/* Dashboard and nested routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {/* Default dashboard page */}
                <Route index element={<Dashboard />} />
                
                {/* Regular user routes */}
                <Route path="shifts" element={<Shifts />} />
                <Route path="team" element={<Team />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                
                {/* Admin routes */}
                <Route path="admin/employees" element={<EmployeeManagement />} />
                <Route path="admin/shifts" element={<ShiftManagement />} />
                <Route path="admin/timeoff" element={<TimeOffManagement />} />
                <Route path="admin/announcements" element={<Announcements />} />
                <Route path="admin/files" element={<FileManagement />} />
                <Route path="admin/collaboration" element={<TeamCollaboration />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
