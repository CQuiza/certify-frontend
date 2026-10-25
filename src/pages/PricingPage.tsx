import { useState } from 'react'
import { ChevronDown, ListChecks } from 'lucide-react'
import { config } from '../config'
import { publicDomain } from '../lib/domain'
import { usePublicBranding } from '../hooks/useConfiguration'
import { waLink } from '../types/course'
import PublicHeader from '../components/organisms/PublicHeader'
import PublicFooter from '../components/organisms/PublicFooter'
import PricingCard, { type PricingPlan } from '../components/molecules/PricingCard'
import PricingFeatureMatrix, { type FeatureCategory } from '../components/organisms/PricingFeatureMatrix'

function formatPrice(value: number): string {
  return new Intl.NumberFormat(config.pricing.locale, {
    style: 'currency',
    currency: config.pricing.currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PricingPage() {
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const domain = publicDomain()

  const monthlyTotal = config.pricing.monthlyTotal
  const semestralTotal = config.pricing.semestralTotal
  const annualTotal = config.pricing.annualTotal
  const semestralMonthly = Math.round(semestralTotal / 6)
  const annualMonthly = Math.round(annualTotal / 12)
  const semestralSavings =
    monthlyTotal > 0
      ? Math.max(0, Math.round((1 - semestralTotal / (monthlyTotal * 6)) * 100))
      : 0
  const annualSavings =
    monthlyTotal > 0
      ? Math.max(0, Math.round((1 - annualTotal / (monthlyTotal * 12)) * 100))
      : 0

  const baseFeatures = [
    <>
      Usuarios, cursos y estudiantes{' '}
      <strong className="font-semibold text-white">sin límites</strong>
    </>,
    <>
      Certificados automáticos con{' '}
      <strong className="font-semibold text-white">código QR de verificación pública</strong>
    </>,
    <>
      Espacio de trabajo{' '}
      <strong className="font-semibold text-white">Multi-tenant con subdominio propio</strong>
      <span className="mt-1 block text-xs text-slate-400">tu-academia.{domain}</span>
    </>,
    <>
      Venta de cursos e inscripciones mediante{' '}
      <strong className="font-semibold text-white">Mercado Pago</strong>
    </>,
    <>Evaluaciones, control de progreso y auditoría</>,
  ]

  const plans: PricingPlan[] = [
    {
      id: 'monthly',
      title: 'Mensual',
      tagline: 'Sin compromisos, cancela cuando quieras.',
      price: formatPrice(monthlyTotal),
      billed: 'Facturado mes a mes',
      features: baseFeatures,
      cta: 'Comenzar Plan Mensual',
      variant: 'secondary',
    },
    {
      id: 'semestral',
      title: 'Semestral',
      badge: `🔥 Ahorra un ${semestralSavings}%`,
      tagline: 'Ideal para academias en proceso de consolidación.',
      price: formatPrice(semestralMonthly),
      billed: `Facturado ${formatPrice(semestralTotal)} cada 6 meses`,
      features: [
        ...baseFeatures,
        <>
          <strong className="font-semibold text-white">Onboarding Estándar Incluido</strong>
        </>,
      ],
      cta: 'Seleccionar Plan Semestral',
      variant: 'primary',
    },
    {
      id: 'annual',
      title: 'Anual',
      badge: `🚀 ¡2 MESES GRATIS! (Ahorro del ${annualSavings}%)`,
      tagline:
        'La opción preferida para instituciones y empresas que buscan acompañamiento VIP.',
      price: formatPrice(annualMonthly),
      billed: `Facturado ${formatPrice(annualTotal)} anualmente`,
      features: [
        ...baseFeatures,
        <>
          <strong className="font-semibold text-white">Migración Asistida de BD incluida</strong>
          <span className="mt-1 block text-xs leading-relaxed text-slate-400">
            Traslado seguro de tu historial previo, estudiantes y certificados de tu sistema
            anterior sin costo.
          </span>
        </>,
        <>
          <strong className="font-semibold text-white">
            Soporte Prioritario &amp; Acompañamiento VIP
          </strong>
        </>,
      ],
      cta: 'Obtener Descuento Anual',
      variant: 'featured',
    },
  ]

  const categories: FeatureCategory[] = [
    {
      title: 'Gestión Académica & LMS',
      items: [
        {
          feature: 'Cursos, Módulos y Lecciones ilimitadas',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Estudiantes y Docentes activos ilimitados',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Evaluaciones automáticas y entrega de tareas',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Monitoreo de progreso en tiempo real',
          monthly: true,
          semestral: true,
          annual: true,
        },
      ],
    },
    {
      title: 'Certificación & Verificación',
      items: [
        {
          feature: 'Generación automática de certificados en PDF',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Portal público de verificación con Código QR',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Control de expiración y renovación de credenciales',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Trazabilidad y registros de auditoría de emisión',
          monthly: true,
          semestral: true,
          annual: true,
        },
      ],
    },
    {
      title: 'Infraestructura & Branding',
      items: [
        {
          feature: `Subdominio propio exclusivo ({tu-organizacion}.${domain})`,
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Personalización White-Label (Logo y marca)',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Aislamiento lógico de datos por Tenant',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Alojamiento de medios e imágenes',
          monthly: true,
          semestral: true,
          annual: true,
        },
      ],
    },
    {
      title: 'Monetización & Pagos',
      items: [
        {
          feature: 'Pasarela de cobro integrada con Mercado Pago',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Catálogo de cursos comprables con Checkout autónomo',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Matrícula automática inmediata tras la aprobación del pago',
          monthly: true,
          semestral: true,
          annual: true,
        },
      ],
    },
    {
      title: 'Servicios de Onboarding & Soporte',
      items: [
        {
          feature: 'Soporte técnico vía ticket / correo',
          monthly: true,
          semestral: true,
          annual: true,
        },
        {
          feature: 'Migración Asistida de BD previa',
          monthly: 'Opcional / Cobro Único',
          semestral: 'Opcional / Cobro Único',
          annual: '🚀 Incluido Gratis',
        },
        {
          feature: 'Canal de atención prioritaria',
          monthly: 'Estándar',
          semestral: 'Estándar',
          annual: '⭐ Prioritario VIP',
        },
      ],
    },
  ]

  function handleSelect(plan: PricingPlan) {
    const message = `Hola, me interesa el Plan ${plan.title} de ${config.appName}. ${plan.billed}. ¿Me ayudan con la activación?`
    window.open(waLink(contactPhone, message), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <PublicHeader />

      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 45% at 15% 0%, rgba(16,185,129,0.20) 0%, rgba(2,6,23,0) 60%), radial-gradient(45% 40% at 90% 10%, rgba(6,182,212,0.16) 0%, rgba(2,6,23,0) 60%)',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-300">
              Planes de suscripción
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Todo lo que tu academia necesita,{' '}
              <span className="text-emerald-400">sin límites.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Elige la frecuencia de pago que mejor se adapte a tu organización. Todas las
              funcionalidades están incluidas en cada plan.
            </p>
          </div>

          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} onSelect={handleSelect} />
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-400">
            Estamos habilitando el pago en línea. Por ahora, solicita tu plan por WhatsApp y te
            acompañamos en la activación.
          </p>

          <div className="mt-16">
            <button
              type="button"
              onClick={() => setFeaturesOpen((open) => !open)}
              aria-expanded={featuresOpen}
              aria-controls="pricing-features"
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-700/80 bg-slate-800/40 px-5 py-4 text-left text-sm font-semibold text-slate-100 backdrop-blur-md transition-colors hover:border-emerald-500/40 hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-emerald-400" />
                Comparar todas las características en detalle
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                  featuresOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              id="pricing-features"
              role="region"
              aria-label="Comparación de características"
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                featuresOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pt-6">
                  <PricingFeatureMatrix categories={categories} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
