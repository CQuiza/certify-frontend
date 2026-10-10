import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import Sidebar from '../organisms/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useActingTenant, useStopImpersonation } from '../../hooks/useTenants'
import { config } from '../../config'
import { Menu, ShieldAlert, LogOut } from 'lucide-react'
import { getErrorMessage } from '../../lib/error'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  const isSuperuser = user?.role === 'superuser'
  const { data: acting } = useActingTenant({ enabled: isSuperuser })
  const stopImpersonation = useStopImpersonation()

  async function handleLeave() {
    try {
      await stopImpersonation.mutateAsync()
    } catch (err) {
      toast.error(getErrorMessage(err))
      return
    }
    if (config.rootDomain) {
      window.location.assign(`https://${config.rootDomain}`)
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">Certify</span>
          </div>
        </div>

        {acting?.slug && (
          <div className="flex items-center justify-between gap-3 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <span className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Actuando como <strong>{acting.slug}</strong> — el superuser está operando dentro de esta organización.
            </span>
            <button
              onClick={handleLeave}
              disabled={stopImpersonation.isPending}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-300 hover:bg-amber-100 disabled:opacity-50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Volver a la plataforma
            </button>
          </div>
        )}

        <Outlet />
      </main>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}