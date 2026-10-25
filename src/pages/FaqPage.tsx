import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, ChevronRight } from 'lucide-react'
import { config } from '../config'
import { usePublicBranding } from '../hooks/useConfiguration'
import { waLink } from '../types/course'
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
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const [messages, setMessages] = useState<{ q: string; a: string }[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function ask(faq: { q: string; a: string }) {
    setMessages((prev) => [...prev, faq])
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Link to="/" className="mb-6 inline-flex text-sm text-slate-500 transition-colors hover:text-slate-700">
          &larr; Volver al inicio
        </Link>
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Preguntas Frecuentes</h1>
          <p className="mt-3 text-slate-600">
            Respuestas a las dudas más comunes sobre {config.appName}.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Questions */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => ask(faq)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-left transition-all duration-200 hover:-translate-x-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-slate-200/60"
              >
                <span className="font-medium text-slate-900">{faq.q}</span>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-600" />
              </button>
            ))}
          </div>

          {/* Assistant */}
          <div ref={chatRef} className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 bg-slate-900 px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Asistente {config.appName}</p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    En línea
                  </p>
                </div>
              </div>

              <div className="max-h-[440px] space-y-4 overflow-y-auto bg-slate-50 p-5">
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm text-slate-700 ring-1 ring-slate-200">
                    ¡Hola! 👋 Elige una pregunta de la izquierda y te responderé al instante.
                  </div>
                </div>

                {messages.map((m, i) => (
                  <div key={i} className="animate-slide-in-left space-y-3">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2.5 text-sm text-white">
                        {m.q}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-700 ring-1 ring-slate-200">
                        {m.a}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-slate-200 bg-white px-5 py-4">
                <p className="text-center text-xs text-slate-500">
                  Este asistente responde preguntas frecuentes. ¿Necesitas algo más?{' '}
                  <a
                    href={waLink(contactPhone, `Hola, tengo una consulta sobre ${config.appName}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                  >
                    Contacta a un asesor
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
