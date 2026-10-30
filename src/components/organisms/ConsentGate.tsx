import { useEffect, useState } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { LEGAL_DOCS } from '../../content/legal'
import LegalMarkdown from './LegalMarkdown'

export default function ConsentGate() {
  const { user, acceptEula, logout } = useAuth()
  const { pathname } = useLocation()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pending =
    user?.role === 'student' &&
    user.eula_pending === true &&
    !pathname.startsWith('/politics')

  useEffect(() => {
    if (!pending) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [pending])

  if (!pending) return null

  const doc = LEGAL_DOCS.eula

  async function handleAccept() {
    if (!accepted || loading) return
    setLoading(true)
    setError('')
    try {
      await acceptEula()
    } catch {
      setError('No pudimos registrar la aceptación. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-gate-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="shrink-0 border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Acceso pendiente
              </p>
              <h2 id="consent-gate-title" className="mt-1 font-display text-xl font-bold text-slate-900">
                {doc.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Debes aceptar este acuerdo para continuar usando la plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <LegalMarkdown markdown={doc.markdown} hideTitle compact />
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>
              He leído y acepto el Acuerdo de Usuario Final y Política de Privacidad.
            </span>
          </label>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <a
                href="/politics?doc=eula"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800"
              >
                Abrir en página completa
              </a>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-slate-700"
              >
                <Lock className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </div>

            <button
              type="button"
              onClick={handleAccept}
              disabled={!accepted || loading}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Guardando…' : 'Aceptar y continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
