import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../organisms/Sidebar'
import { Menu } from 'lucide-react'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        <Outlet />
      </main>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
