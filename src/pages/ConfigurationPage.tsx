import { useState } from 'react'
import { FileText, Building2, Mail, CreditCard } from 'lucide-react'
import PageHeader from '../components/molecules/PageHeader'
import CertificateConfiguration from '../components/organisms/configuration/CertificateConfiguration'
import OrganizationConfiguration from '../components/organisms/configuration/OrganizationConfiguration'
import EmailConfiguration from '../components/organisms/configuration/EmailConfiguration'
import PaymentsConfiguration from '../components/organisms/configuration/PaymentsConfiguration'

type ConfigTabId = 'certificate' | 'organization' | 'email' | 'payments'

const tabs: { id: ConfigTabId; label: string; icon: typeof FileText }[] = [
  { id: 'certificate', label: 'Certificado', icon: FileText },
  { id: 'organization', label: 'Organización', icon: Building2 },
  { id: 'email', label: 'Correo', icon: Mail },
  { id: 'payments', label: 'Pagos', icon: CreditCard },
]

export default function ConfigurationPage() {
  const [tab, setTab] = useState<ConfigTabId>('certificate')

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Configuración" subtitle="Personalización de la plataforma" />

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
      {tab === 'organization' && <OrganizationConfiguration />}
      {tab === 'email' && <EmailConfiguration />}
      {tab === 'payments' && <PaymentsConfiguration />}
    </div>
  )
}