import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Globe2,
  GraduationCap,
  Lock,
  LineChart,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { config } from '../config'
import { usePublicBranding } from '../hooks/useConfiguration'
import { waLink } from '../types/course'
import PublicHeader from '../components/organisms/PublicHeader'
import PublicFooter from '../components/organisms/PublicFooter'

const benefits = [
  {
    icon: Building2,
    title: 'Gestión Multitenant White-Label',
    desc: 'Espacios de trabajo personalizados para cada organización o cliente, con su propia marca, subdominio y datos totalmente aislados.',
  },
  {
    icon: BadgeCheck,
    title: 'Automatización de Certificados',
    desc: 'Emisión y validación pública inmediata con códigos QR verificables, vigencias y reglas de re-certificación automáticas.',
  },
  {
    icon: CreditCard,
    title: 'Monetización de Cursos',
    desc: 'Catálogo integrado con pasarela de pago para la venta autónoma de capacitaciones, con carrito y compra sin fricción.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y Control de Progreso',
    desc: 'Evaluaciones, auditoría simple, roles de administración y seguimiento del progreso de cada estudiante en tiempo real.',
  },
]

const steps = [
  {
    icon: Sparkles,
    title: 'Crea tu academia',
    desc: 'Configura tu espacio white-label con tu marca, catálogo y reglas de certificación.',
  },
  {
    icon: GraduationCap,
    title: 'Publica o vende cursos',
    desc: 'Estructura módulos, lecciones, tareas y evaluaciones. Habilita la venta con pago en línea.',
  },
  {
    icon: Workflow,
    title: 'El estudiante completa la evaluación',
    desc: 'Avanza a su ritmo, entrega tareas y supera las evaluaciones por módulo.',
  },
  {
    icon: QrCode,
    title: 'Certificados verificables automáticamente',
    desc: 'Al completar el curso se emite el certificado con UUID y QR de validación pública.',
  },
]

const trust = [
  {
    icon: FileCheck2,
    title: 'Educación informal alineada',
    desc: 'Constancias de asistencia conformes a la Ley 115 de 1994 y el Decreto 1075 de 2015.',
  },
  {
    icon: ShieldCheck,
    title: 'Calidad NTC 3100',
    desc: 'Trazabilidad de contenidos, evaluaciones y certificaciones para formación no formal.',
  },
  {
    icon: Lock,
    title: 'Habeas Data (Ley 1581)',
    desc: 'Depuración programada de datos y retención documental responsable.',
  },
  {
    icon: LineChart,
    title: 'Trazabilidad y reportes',
    desc: 'Auditoría de emisiones, intentos de evaluación y progreso en tiempo real.',
  },
]

export default function HomePage() {
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const demoLink = waLink(
    contactPhone,
    'Hola, quiero solicitar una demo de Acreditapp para mi organización.',
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(60% 60% at 15% 10%, rgba(99,102,241,0.28) 0%, rgba(15,23,42,0) 60%), radial-gradient(50% 50% at 90% 20%, rgba(16,185,129,0.20) 0%, rgba(15,23,42,0) 55%)',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              SaaS multitenant para capacitación corporativa
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              La infraestructura tecnológica para gestionar, vender y certificar tus
              capacitaciones corporativas
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 lg:mx-0">
              Escala tu academia con espacios white-label para cada organización,
              certificación automatizada con QR verificable y control de progreso de
              principio a fin.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 sm:w-auto"
              >
                Probar Acreditapp
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Solicitar Demo
              </a>
            </div>
          </div>

          {/* Product preview mock */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-2 shadow-2xl backdrop-blur">
              <div className="rounded-xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <QrCode className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Verificación de certificado</p>
                      <p className="text-xs text-slate-500">acreditapp.com/verificar</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Válido
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ['Titular', 'María Fernanda Ríos'],
                    ['Programa', 'Diplomado en Seguridad y Salud'],
                    ['Intensidad', '150 horas'],
                    ['Vigencia', '3 años'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-medium text-slate-900">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                  <span className="font-mono text-xs text-slate-500">UUID 8f3c…a91b</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                    <Globe2 className="h-3.5 w-3.5" />
                    Validación pública
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Todo lo que tu academia necesita en una sola plataforma
            </h2>
            <p className="mt-4 text-slate-500">
              Diseñada para empresas de capacitación, academias e instituciones que
              ofrecen educación complementaria e informal.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div
                  key={b.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-slate-900">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="como-funciona" className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              De la capacitación al certificado, sin fricción
            </h2>
            <p className="mt-4 text-slate-500">
              Un flujo claro y automatizado para que tu equipo se enfoque en enseñar.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                  <span className="absolute -top-3 left-6 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust / normative */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Confianza y cumplimiento para el contexto colombiano
            </h2>
            <p className="mt-4 text-slate-500">
              Pensada para operar con transparencia, trazabilidad y buenas prácticas.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.title} className="rounded-2xl border border-slate-200 p-6">
                  <Icon className="h-5 w-5 text-slate-900" />
                  <h3 className="mt-4 font-semibold text-slate-900">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{t.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Empieza a certificar con tu propia marca hoy
          </h2>
          <p className="max-w-2xl text-slate-300">
            Crea tu academia, publica tus cursos y emite certificados verificables de
            forma automática.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
            >
              Probar Acreditapp
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar Demo
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
