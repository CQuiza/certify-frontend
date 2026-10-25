import type { UserRole } from '../types'

export const ROLE_LABELS: Record<UserRole, string> = {
  superuser: 'Superusuario',
  admin: 'Administrador',
  teacher: 'Docente',
  student: 'Estudiante',
}

export function panelPathFor(role?: UserRole): string {
  return role === 'student' || role === 'teacher' ? '/courses' : '/dashboard'
}
