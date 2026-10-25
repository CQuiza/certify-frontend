import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  Database,
  FileCheck2,
  Globe2,
  Lock,
  LineChart,
  MessageCircle,
  QrCode,
  Rocket,
  ShieldCheck,
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
    title: 'Gestión de Marca Personalizada',
    desc: 'Espacios de trabajo personalizados para cada organización o cliente, con su propia marca, subdominio y datos totalmente aislados.',
  },
  {
    icon: BadgeCheck,
    title: 'Automatización de Certificados',
    desc: 'Compra, evaluación, emisión y validación pública inmediata con códigos QR verificables, vigencias y método de re-certificación automáticas.',
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
    title: 'Crea tu academia',
    desc: 'Configura tu espacio personalizado con tu marca, catálogo y oferta de certificación.',
  },
  {
    title: 'Publica o vende cursos',
    desc: 'Estructura módulos, lecciones, tareas y evaluaciones. Habilita la venta con pago en línea.',
  },
  {
    title: 'El estudiante completa la evaluación',
    desc: 'Avanza a su ritmo, entrega tareas y supera las evaluaciones por módulo.',
  },
  {
    title: 'Certificados verificables automáticamente',
    desc: 'Al completar el curso se emite el certificado con UUID y QR de validación pública.',
  },
]

const trust = [
  {
    icon: FileCheck2,
    title: 'Educación informal alineada',
    desc: 'Conformidad con la Ley 115 de 1994 y el Decreto 1075 de 2015.',
  },
  {
    icon: ShieldCheck,
    title: 'Resolución 3100 de 2019',
    desc: 'Trazabilidad y auditoría para el estándar de talento humano en la formación continua.',
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

const successCases = [
  {
    name: 'Innova Center',
    logo: '/logos/innova-center.png',
    logoClass: 'h-10 md:h-12',
    url: 'http://innova-center.com/',
    tag: 'Educación & Innovación',
    model: 'Single Tenancy / On-Premise',
    highlights: [
      'Plataforma dedicada para la administración de procesos formativos.',
      'Gestión de usuarios e infraestructura de desarrollo.',
    ],
  },
  {
    name: 'Innova Salud',
    logo: '/logos/innova-salud.png',
    logoClass: 'h-10 md:h-12',
    url: 'https://innova-salud.com.co/',
    tag: 'Sector Salud & Ecosistemas Digitales',
    model: 'Single Tenancy / On-Premise',
    highlights: [
      'Alta disponibilidad y seguridad de datos sensibles.',
      'Trazabilidad y cumplimiento normativo.',
    ],
  },
  {
    name: 'Medi Center',
    logo: '/logos/medi-center.png',
    logoClass: 'h-10 md:h-12',
    url: 'http://medi-center.com.co/',
    tag: 'Gestión educativa Integral',
    model: 'Single Tenancy / On-Premise',
    highlights: [
      'Control centralizado de registros y usuarios.',
      'Administración integral de contenido de salud.',
    ],
  },
]

export default function HomePage() {
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const demoLink = waLink(
    contactPhone,
    `Hola, quiero solicitar una demo de ${config.appName} para mi organización.`,
  )
  const migrationLink = waLink(
    contactPhone,
    `Hola, quiero una consulta sobre Migración de Datos para mi organización (${config.appName}).`,
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
              'radial-gradient(60% 60% at 15% 10%, rgba(16,185,129,0.30) 0%, rgba(15,23,42,0) 60%), radial-gradient(50% 50% at 90% 20%, rgba(6,182,212,0.22) 0%, rgba(15,23,42,0) 55%)',
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-300">

              VENDE, CAPACITA Y CERTIFICA EN UN SOLO LUGAR.
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              La infraestructura tecnológica para gestionar, vender y certificar tus
              capacitaciones corporativas
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 lg:mx-0">
              Escala tu academia con espacios personalizables para cada organización,
              certificación automatizada con QR verificable y control de progreso de
              principio a fin.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 sm:w-auto"
              >
                Probar {config.appName}
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <QrCode className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Verificación de certificado</p>
                      <p className="text-xs text-slate-500">{config.appName.toLowerCase()}.com/verificar</p>
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
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
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
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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

      {/* Migration service */}
      <section id="migracion" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl sm:p-12">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(50% 50% at 12% 0%, rgba(2,132,199,0.20) 0%, rgba(15,23,42,0) 60%), radial-gradient(45% 45% at 92% 100%, rgba(16,185,129,0.18) 0%, rgba(15,23,42,0) 60%)',
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                ¿YA OPERAS EN OTRO SISTEMA?
              </span>
              <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trae tu Base de Datos sin perder nada.{' '}
                <span className="text-emerald-300">Nos encargamos del resto.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Servicio de Onboarding y Migración Asistida para que inicies la operación con tus datos.
              </p>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                {/* Legacy system */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/60 text-slate-300">
                      <Database className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-white">Tu Sistema Actual</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-400">
                    {[
                      'Base de datos de estudiantes',
                      'Historial de cursos y contenido',
                      'Certificados emitidos',
                    ].map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Migration engine connector */}
                <div className="flex flex-col items-center gap-3 lg:flex-row lg:px-2">
                  <span className="whitespace-nowrap rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                    Migración Personalizada
                  </span>
                  <div className="relative h-10 w-0.5 overflow-hidden rounded-full bg-white/10 transition-colors group-hover:bg-white/20 lg:h-0.5 lg:w-24">
                    <span className="absolute left-0 h-6 w-full animate-shimmer-y rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.7)] transition-shadow group-hover:shadow-[0_0_14px_4px_rgba(34,211,238,0.9)] lg:top-0 lg:h-full lg:w-10 lg:animate-shimmer-x" />
                  </div>
                </div>

                {/* Formativa tenant */}
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-white">Tu Espacio en {config.appName}</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-emerald-100/80">
                    {[
                      '100% Datos intactos y reales',
                      'Verificación QR activa',
                      'Listo para operar en 24–48h',
                    ].map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    t: 'Sin interrupciones',
                    d: 'Tu academia o empresa no detiene operaciones durante la transición.',
                  },
                  {
                    t: 'Validación e integridad',
                    d: 'Verificamos duplicados y consistencia de datos antes del lanzamiento.',
                  },
                  {
                    t: 'Costo transparente',
                    d: 'Tarifa única (one-time fee) adicional a tu plan de suscripción al activar tu espacio.',
                  },
                ].map((b) => (
                  <div
                    key={b.t}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-white/[0.08] hover:shadow-[0_8px_30px_-8px_rgba(16,185,129,0.35)]"
                  >
                    <p className="font-semibold text-white">{b.t}</p>
                    <p className="mt-1 text-sm text-slate-400">{b.d}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <a
                  href={migrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  <Rocket className="h-4 w-4" />
                  Solicitar evaluación de migración
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              De la capacitación al certificado, sin fricción
            </h2>
            <p className="mt-4 text-slate-500">
              Un flujo claro y automatizado para que tu equipo se enfoque en enseñar.
            </p>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="group flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1.5 motion-reduce:hover:translate-y-0"
              >
                <span
                  aria-hidden
                  className="self-end font-display text-6xl font-extrabold leading-none tracking-tight text-emerald-600 tabular-nums transition-all duration-300 [text-shadow:0_0_0_transparent] group-hover:text-emerald-400 group-hover:[text-shadow:0_0_5px_rgba(52,211,153,0.55),0_0_12px_rgba(16,185,129,0.3)] motion-reduce:transition-none"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mt-4 border-t border-slate-200 pt-5 transition-colors group-hover:border-emerald-300">
                  <h3 className="text-left text-xl font-bold leading-snug text-slate-900">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / normative */}
      <section className="bg-slate-50 py-20">
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

      {/* Success cases */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              RESPALDO ENTERPRISE
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:whitespace-nowrap">
              Experiencia Comprobada, Conocemos el Negocio
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Hemos creado soluciones empresariales para las necesidades especificas del mercado.
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-start">
            {successCases.map((c) => (
              <div
                key={c.name}
                className="group relative flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-500 ease-out md:hover:flex-[1.7] md:hover:border-slate-700"
              >
                <div className="flex justify-center transition-all duration-500 md:group-hover:mb-6 md:group-hover:justify-start">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${c.name} — sitio web`}
                    className="inline-flex"
                  >
                    <img
                      src={c.logo}
                      alt={c.name}
                      className={`w-auto origin-left opacity-100 transition-all duration-500 md:opacity-60 md:grayscale md:group-hover:scale-[2] md:group-hover:opacity-100 md:group-hover:grayscale-0 ${c.logoClass}`}
                    />
                  </a>
                </div>

                <div className="max-h-[520px] overflow-hidden opacity-100 transition-all duration-500 ease-out md:max-h-0 md:opacity-0 md:group-hover:max-h-[520px] md:group-hover:opacity-100">
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                      {c.tag}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                      {c.model}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-400">
                    {c.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <p className="max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-center text-lg font-semibold text-slate-800">
              Este conocimiento ahora se integra para impulsar{' '}
              <span className="text-emerald-600">{config.appName}</span>.
            </p>
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
              Probar {config.appName}
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

      <PublicFooter showDeveloper />
    </div>
  )
}
