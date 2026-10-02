import { useState } from 'react'
import { FileText, Settings } from 'lucide-react'
import CertificateConfiguration from '../components/organisms/configuration/CertificateConfiguration'

type ConfigTabId = 'certificate'

const tabs: { id: ConfigTabId; label: string; icon: typeof FileText }[] = [
  { id: 'certificate', label: 'Certificado', icon: FileText },
]

export default function ConfigurationPage() {
  const [tab, setTab] = useState<ConfigTabId>('certificate')

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-6 w-6 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
          <p className="mt-1 text-sm text-slate-500">Personalización de la plataforma</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {tabs.map((t) => {
          const active = tab === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'certificate' && <CertificateConfiguration />}
    </div>
  )
}