import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, FileText, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'

import PublicFooter from '../components/organisms/PublicFooter'
import PublicHeader from '../components/organisms/PublicHeader'
import LegalMarkdown from '../components/organisms/LegalMarkdown'
import { config } from '../config'
import { LEGAL_DOCS, isLegalDocId, type LegalDocId } from '../content/legal'
import { extractHeadings } from '../lib/legal'

export default function PoliticsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('doc')
  const docId: LegalDocId = isLegalDocId(requested) ? requested : 'terminos'
  const doc = LEGAL_DOCS[docId]
  const headings = useMemo(() => extractHeadings(doc.markdown), [doc.markdown])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = `${doc.title} — ${config.appName}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [doc.title])

  function selectDoc(id: LegalDocId) {
    setSearchParams({ doc: id })
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Enlace copiado')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Legal
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Políticas y términos
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Consulta los términos aplicables a las organizaciones y el acuerdo de
            usuario final para estudiantes. Puedes revisar cada documento y compartir
            un enlace directo a sus secciones.
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Documentos legales"
        >
          {Object.values(LEGAL_DOCS).map((item) => {
            const active = item.id === docId
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectDoc(item.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                <FileText className="h-4 w-4" />
                {item.shortTitle}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                En este documento
              </p>
              <nav className="mt-4 space-y-2">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm leading-5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-emerald-700"
                  >
                    {heading.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Enlace copiado' : 'Copiar enlace'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
            </div>
          </aside>

          <details className="rounded-2xl border border-slate-200 bg-white p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Índice del documento
            </summary>
            <nav className="mt-3 space-y-2">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="block text-sm text-slate-500 hover:text-emerald-700"
                >
                  {heading.title}
                </a>
              ))}
            </nav>
          </details>

          <section className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <div className="mb-7 border-b border-slate-200 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Documento legal
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
                  {doc.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {doc.description}
                </p>
                <p className="mt-4 text-xs text-slate-400">
                  Versión {doc.version} · Actualizado el {doc.updatedAt}
                </p>
              </div>

              <LegalMarkdown markdown={doc.markdown} hideTitle />
            </div>

            <p className="mt-5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs leading-5 text-slate-500">
              Si tienes dudas sobre la aplicación de estos términos, contacta a la
              organización que ofrece el curso. Formativa presta la infraestructura
              tecnológica de la plataforma.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
