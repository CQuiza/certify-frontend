export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  hideCoursesForAdmin: import.meta.env.VITE_HIDE_COURSES_FOR_ADMIN?.toLowerCase() === 'true',
  showTeacherRole: import.meta.env.VITE_SHOW_TEACHER_ROLE?.toLowerCase() === 'true',
  appName: import.meta.env.VITE_APP_NAME || 'Certify',
} as const
