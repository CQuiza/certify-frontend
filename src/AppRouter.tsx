import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import FaqPage from './pages/FaqPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import CertificatesPage from './pages/CertificatesPage'
import CoursesPage from './pages/CoursesPage'
import CertificateTypesPage from './pages/CertificateTypesPage'
import CertificateAuditPage from './pages/CertificateAuditPage'
import CourseDetailPage from './pages/CourseDetailPage'
import LessonViewPage from './pages/LessonViewPage'
import DashboardLayout from './components/organisms/DashboardLayout'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function AppRouter() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonViewPage />} />
        <Route path="/certificate-types" element={<CertificateTypesPage />} />
        <Route path="/audit" element={<CertificateAuditPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
