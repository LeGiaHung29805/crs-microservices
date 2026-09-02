// path: crs-frontend/src/App.tsx
// purpose: khai báo toàn bộ Router của ứng dụng

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import RegisterCoursePage from './pages/RegisterCoursePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses" element={<CoursesPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminCoursesPage />
              </ProtectedRoute>
            }
          />
          {/* Alias route cho /admin/course */}
          <Route path="/admin/course" element={<Navigate to="/admin/courses" replace />} />

          {/* Student Routes */}
          <Route
            path="/register-course"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <RegisterCoursePage />
              </ProtectedRoute>
            }
          />
          {/* Alias route cho lỗi gõ thiếu/nhầm: /register-coures & /register-courses */}
          <Route path="/register-coures" element={<Navigate to="/register-course" replace />} />
          <Route path="/register-courses" element={<Navigate to="/register-course" replace />} />

          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route cho đường dẫn không hợp lệ - LUÔN NẰM DƯỚI CÙNG */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;