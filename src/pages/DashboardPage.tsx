import { useAuth } from '../context/AuthContext'
import { usePlatform } from '../hooks/usePlatform'
import { useDashboardStats, useDashboardAdmins } from '../hooks/useDashboard'
import Card from '../components/molecules/Card'
import Skeleton from '../components/atoms/Skeleton'
import ErrorState from '../components/atoms/ErrorState'
import { Link } from 'react-router-dom'
import { Users, Award, GraduationCap, FileCheck, CheckCircle, XCircle, Clock, BarChart3, ShieldCheck } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { dashboardMessage } = usePlatform()
  const isStaff = !!user && ['superuser', 'admin', 'teacher'].includes(user.role)
  const isAdmin = !!user && ['superuser', 'admin'].includes(user.role)

  const { data: statsData, isLoading, isError } = useDashboardStats({ enabled: isStaff })
  const { data: admins, isLoading: loadingAdmins } = useDashboardAdmins({ enabled: isAdmin })

  const stats = [
    {
      label: 'Usuarios activos',
      value: isStaff ? (statsData?.total_users ?? '—') : '—',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50',
      loading: isLoading,
    },
    {
      label: 'Total certificados',
      value: statsData?.total_certificates ?? '—',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50',
      loading: isLoading,
    },
    {
      label: 'Cursos publicados',
      value: statsData?.published_courses ?? '—',
      icon: GraduationCap,
      color: 'text-amber-600 bg-amber-50',
      loading: isLoading,
    },
    {
      label: 'Tipos de certificado',
      value: isStaff ? (statsData?.certificate_types ?? '—') : '—',
      icon: FileCheck,
      color: 'text-blue-600 bg-blue-50',
      loading: isLoading,
    },
  ]

  const certStatusCards = [
    { label: 'Activos', value: statsData?.active_certificates ?? '—', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Expirados', value: statsData?.expired_certificates ?? '—', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Revocados', value: statsData?.revoked_certificates ?? '—', icon: XCircle, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Bienvenido, {user?.name || 'Usuario'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {dashboardMessage || 'Panel principal de la plataforma Certify'}
        </p>
      </div>

      {isError && <ErrorState className="mb-6" />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  {stat.loading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  )}
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold text-slate-900">Estado de Certificados</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {certStatusCards.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.label}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{c.value}</p>
                  <p className="text-sm text-slate-500">{c.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {isAdmin && (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Administradores</h2>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Reportes
            </Link>
          </div>
          <Card className="mt-2" padding={false}>
            {loadingAdmins ? (
              <div className="space-y-3 p-6"><Skeleton count={3} className="h-10 w-full" /></div>
            ) : !admins || admins.length === 0 ? (
              <p className="px-6 py-6 text-sm text-slate-500">No hay administradores registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Nombres</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Documento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Correo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {admins.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 font-mono text-xs text-indigo-600"><ShieldCheck className="h-3.5 w-3.5" />{String(a.id).padStart(4, '0')}</span></td>
                        <td className="px-6 py-3 text-slate-800">{`${a.name} ${a.first_last_name || ''} ${a.second_last_name || ''}`.trim()}</td>
                        <td className="px-6 py-3 text-slate-600">{`${a.identity_type} ${a.identity_number}`}</td>
                        <td className="px-6 py-3 text-slate-600">{a.email}</td>
                        <td className="px-6 py-3 text-slate-600">{a.phone_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
