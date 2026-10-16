import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { config } from '../config'
import PublicHeader from '../components/organisms/PublicHeader'
import PublicFooter from '../components/organisms/PublicFooter'

const faqs = [
  {
    q: `¿Qué es ${config.appName}?`,
    a: `${config.appName} es una infraestructura SaaS multitenant white-label que permite gestionar, vender, dictar y certificar procesos de formación corporativa. Cada organización opera en su propio espacio con su marca, catálogo y reglas de certificación.`,
  },
  {
    q: '¿Para quién está pensada?',
    a: 'Para empresas de capacitación, academias e instituciones que ofrecen educación complementaria e informal. La plataforma tiene cuatro roles: superusuario (operación de la plataforma), administrador (organización), docente (contenido y evaluación) y estudiante.',
  },
  {
    q: '¿Cómo funciona el modelo multitenant white-label?',
    a: 'Cada organización (tenant) cuenta con un espacio exclusivo bajo su propio subdominio o dominio personalizado, con su marca, usuarios y datos totalmente aislados del resto de organizaciones.',
  },
  {
    q: '¿Cómo se emiten los certificados?',
    a: 'Pueden emitirse de forma automática al completar el curso (todas las evaluaciones aprobadas y todas las tareas entregadas) o manualmente por un administrador. Cada certificado recibe un UUID único, un código QR y un PDF verificable.',
  },
  {
    q: '¿Los certificados tienen validez legal?',
    a: `${config.appName} emite constancias y certificados de educación informal con trazabilidad y verificación pública. La validez legal depende de las políticas de cada organización. La plataforma está alineada con el marco colombiano de educación informal (Ley 115 de 1994 y Decreto 1075 de 2015), con la norma NTC 3100 y con el tratamiento de datos (Ley 1581 de 2012).`,
  },
  {
    q: '¿Cómo se verifica un certificado?',
    a: 'Cada certificado incluye un código QR y un UUID. Cualquier persona puede escanear el QR o ingresar el número de identificación en la página de verificación pública, sin necesidad de autenticarse.',
  },
  {
    q: '¿Se pueden vender cursos en línea?',
    a: 'Sí. El catálogo se integra con una pasarela de pago (Checkout Pro de Mercado Pago) para la venta autónoma de capacitaciones en pesos colombianos, con carrito, pago en línea y verificación server-to-server del pago.',
  },
  {
    q: '¿Qué incluye un curso?',
    a: 'Cada curso se compone de módulos y lecciones con contenido de texto, imágenes, videos y archivos adjuntos. Los docentes pueden crear tareas y evaluaciones por módulo con puntaje mínimo de aprobación.',
  },
  {
    q: '¿Qué puede hacer cada rol?',
    a: 'El superusuario gestiona la plataforma y las organizaciones; el administrador gestiona usuarios, cursos, certificados y auditoría de su organización; el docente gestiona el contenido y la evaluación de los cursos que tiene asignados; el estudiante consume el contenido, entrega tareas, presenta evaluaciones y consulta sus certificados.',
  },
  {
    q: '¿Cómo se asignan los cursos a los estudiantes?',
    a: 'Un administrador o docente puede inscribir estudiantes manualmente, o el estudiante puede inscribirse automáticamente al comprar un curso desde el catálogo.',
  },
  {
    q: '¿Se pueden renovar certificados vencidos?',
    a: 'Sí. El estudiante puede solicitar la renovación (con costo o gratuita según el curso) o un administrador puede iniciarla. La renovación reasigna el curso y reinicia el progreso: el certificado se reactiva al completar nuevamente el curso.',
  },
  {
    q: '¿Cómo puedo contactar soporte?',
    a: `Puedes contactarnos a través del teléfono ${config.contactPhone}, correo ${config.contactEmail} o visitarnos en ${config.cityCountry}.`,
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/" className="mb-6 inline-flex text-sm text-slate-500 hover:text-slate-700 transition-colors">&larr; Volver al inicio</Link>
        <h1 className="text-3xl font-bold text-slate-900">Preguntas Frecuentes</h1>
        <p className="mt-2 text-slate-600">Respuestas a las dudas más comunes sobre {config.appName}.</p>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i
            return (
              <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{faq.q}</span>
                  {open ? <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" /> : <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />}
                </button>
                {open && (
                  <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
