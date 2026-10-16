import { useState, useMemo } from 'react'
import { FileText, QrCode, Search, User, IdCard, Calendar, Clock, AlertCircle } from 'lucide-react'
import Card from '../components/molecules/Card'
import Badge from '../components/atoms/Badge'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import Skeleton from '../components/atoms/Skeleton'
import PublicHeader from '../components/organisms/PublicHeader'
import PublicFooter from '../components/organisms/PublicFooter'
import { useCertificateTypes } from '../hooks/useCertificateTypes'
import { certificateStatusVariant } from '../lib/statusVariant'
import { formatDate } from '../lib/dates'
import { config } from '../config'
import api from '../services/api'
import type { Certificate } from '../types'

interface SearchResult {
  user_name: string | null
  user_email: string | null
  identity_number: string | null
  certificates: Certificate[]
}

export default function SearchPage() {
  const [identityNumber, setIdentityNumber] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: certTypes } = useCertificateTypes({ limit: 2000 })
  const typeMap = useMemo(() => {
    if (!certTypes) return {} as Record<number, string>
    return Object.fromEntries(certTypes.map((t) => [t.id, t.name]))
  }, [certTypes])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!identityNumber.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.get<SearchResult[]>(`/certificates/search-by-identity/${encodeURIComponent(identityNumber.trim())}`)
      if (data.length > 0) setResult(data[0])
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } }
        if (axiosErr.response?.status === 404) {
          setError('No se encontraron certificados para esta identidad.')
        } else {
          setError(axiosErr.response?.data?.detail || 'Error al consultar los certificados.')
        }
      } else {
        setError('Error de conexión. Intente nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader useTenantLogo />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Verificar Certificados</h1>
              <p className="mt-2 text-slate-500">Ingresa tu número de identificación para consultar tus certificados</p>
            </div>
            <Card className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Número de identificación"
                  placeholder="Ej: 1234567890"
                  value={identityNumber}
                  onChange={(e) => setIdentityNumber(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  <Search className="h-4 w-4" />
                  Consultar
                </Button>
              </form>
            </Card>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <img
              src="/logos/certified.png"
              alt="Calidad certificada"
              className="w-full grayscale transition duration-500 hover:grayscale-0"
            />
          </div>
        </div>

        {loading && (
          <div className="mt-6 space-y-4">
            <Skeleton count={3} className="h-16 w-full" />
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <Card>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">{result.user_name || 'Usuario'}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <IdCard className="h-3.5 w-3.5" />
                        {result.identity_number}
                      </span>
                    </div>
                </div>
              </div>
            </Card>

            <h2 className="text-lg font-semibold text-slate-900">
              Certificados encontrados ({result.certificates.length})
            </h2>

            {result.certificates.map((cert) => (
              <Card key={cert.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={certificateStatusVariant(cert.status)}>{cert.status}</Badge>
                      {cert.certificate_type_id != null && typeMap[cert.certificate_type_id] && (
                        <span className="min-w-0 break-words text-base font-bold text-slate-900">
                          {typeMap[cert.certificate_type_id]}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>Emitido: {formatDate(cert.issued_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>Expira: {cert.expires_at ? formatDate(cert.expires_at) : '—'}</span>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-slate-400">ID: {cert.unique_id.slice(0, 8)}...</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a
                      href={`${config.apiUrl}/certificates/view/${cert.unique_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      PDF
                    </a>
                    <a
                      href={`${config.apiUrl}/certificates/view/${cert.unique_id}/qr`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      QR
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  )
}
