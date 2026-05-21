import { Home, Users, GraduationCap, Award, LayoutDashboard, FileCheck, ClipboardList, LogOut, X, HelpCircle } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types'

interface NavItem {
  label: string
  path: string
  icon: typeof Home
  roles: UserRole[]
}

const navItems: NavItem[] = [
  { label: 'Inicio', path: '/', icon: Home, roles: ['superuser', 'admin', 'teacher', 'student'] },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['superuser', 'admin', 'teacher'] },
  { label: 'Usuarios', path: '/users', icon: Users, roles: ['superuser', 'admin'] },
  { label: 'Cursos', path: '/courses', icon: GraduationCap, roles: ['superuser', 'admin', 'teacher', 'student'] },
  { label: 'Certificados', path: '/certificates', icon: Award, roles: ['superuser', 'admin', 'teacher', 'student'] },
  { label: 'Tipos de Certificado', path: '/certificate-types', icon: FileCheck, roles: ['superuser', 'admin'] },
  { label: 'Auditoría', path: '/audit', icon: ClipboardList, roles: ['superuser', 'admin'] },
  { label: 'FAQ', path: '/faq', icon: HelpCircle, roles: ['superuser', 'admin', 'teacher', 'student'] },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const filtered = navItems.filter((item) => user && item.roles.includes(user.role))

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Certify</p>
            <p className="text-xs text-slate-500">Plataforma</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filtered.map((item) => {
          const active = pathname === item.path || pathname.startsWith(item.path + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name || 'Usuario'}</p>
            <p className="truncate text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      <aside className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  )
}
