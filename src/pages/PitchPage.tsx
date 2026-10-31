import { useEffect } from 'react'
import { ArrowRight, Download, MessageCircle } from 'lucide-react'

import PublicFooter from '../components/organisms/PublicFooter'
import PublicHeader from '../components/organisms/PublicHeader'
import LazyPdfPreview from '../components/organisms/LazyPdfPreview'
import { config } from '../config'
import { usePublicBranding } from '../hooks/useConfiguration'
import { waLink } from '../types/course'

const PDF_URL = '/pitch/presentacion-corporativa-b2b.pdf'

const highlights = [
  {
    title: 'White-label multitenant',
    description: 'Cada organización con su propia marca, subdominio y datos aislados.',
  },
  {
    title: 'Certificación con QR',
    description: 'Emisión automática, UUID y validación pública en tiempo real.',
  },
  {
    title: 'Venta y progreso',
    description: 'Catálogo, pagos, evaluaciones y seguimiento del estudiante en un solo lugar.',
  },
]

export default function PitchPage() {
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const demoLink = waLink(
    contactPhone,
    `Hola, quiero solicitar una demo de ${config.appName} para mi organización.`,
  )

  useEffect(() => {
    document.title = `Presentación corporativa — ${config.appName}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Formativa para empresas
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Presentación corporativa
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Conoce cómo Formativa permite lanzar una academia digital con marca propia,
            certificación verificable y venta de capacitaciones en línea.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={PDF_URL}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Descargar presentación
          </a>
          <a
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Solicitar demo
          </a>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Presentación completa
            </h2>
            <span className="text-xs text-slate-400">
              PDF · {config.appName}
            </span>
          </div>
          <LazyPdfPreview
            source={PDF_URL}
            title="Presentación corporativa de Formativa"
            className="h-[75vh] min-h-[420px] w-full"
            downloadUrl={PDF_URL}
          />
        </section>

        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Lleva tu capacitación al siguiente nivel
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Agenda una demostración guiada y descubre cómo obtener tu propia academia
            digital personalizada con {config.appName}.
          </p>
          <a
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Agendar demo
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
