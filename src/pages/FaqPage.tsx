import { Link } from 'react-router-dom'
import { Award, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    q: '¿Qué es Certify?',
    a: 'Certify es una plataforma de certificación profesional que permite gestionar, emitir y verificar certificados académicos y profesionales de forma segura, rápida y centralizada.',
  },
  {
    q: '¿Quiénes pueden usar Certify?',
    a: 'La plataforma está diseñada para instituciones educativas, empresas y organizaciones que necesiten emitir certificados. Los roles disponibles son: superusuario, administrador, docente y estudiante.',
  },
  {
    q: '¿Cómo se emite un certificado?',
    a: 'Los administradores y superusuarios pueden emitir certificados desde la sección "Certificados" del panel. Solo necesitan seleccionar el usuario y el tipo de certificado, y el sistema genera automáticamente un certificado digital con UUID único y código QR.',
  },
  {
    q: '¿Los certificados son válidos legalmente?',
    a: 'Certify genera certificados digitales con códigos QR y UUID únicos que permiten su verificación en línea. La validez legal depende de las políticas de cada institución u organización.',
  },
  {
    q: '¿Cómo se verifica un certificado?',
    a: 'Cada certificado incluye un código QR y un UUID único. Cualquier persona puede escanear el QR o ingresar el UUID en la plataforma para verificar la autenticidad del certificado.',
  },
  {
    q: '¿Qué tipos de certificado existen?',
    a: 'Actualmente hay tres tipos: básico (45 horas, 1 año de vigencia), avanzado (70 horas, 2 años) y diplomado (150 horas, 3 años). Los administradores pueden crear tipos personalizados.',
  },
  {
    q: '¿Los docentes pueden crear cursos?',
    a: 'Los docentes pueden crear y gestionar módulos y lecciones dentro de los cursos que tienen asignados. Los cursos son creados por administradores o superusuarios.',
  },
  {
    q: '¿Cómo se asignan cursos a estudiantes?',
    a: 'Los administradores y superusuarios pueden asignar cursos a estudiantes y docentes desde la sección "Usuarios", usando el botón de cursos en cada usuario.',
  },
  {
    q: '¿Qué información contiene una lección?',
    a: 'Cada lección puede incluir contenido de texto, imágenes, videos y archivos adjuntos. Los docentes pueden estructurar el contenido en módulos dentro de cada curso.',
  },
  {
    q: '¿Cómo puedo contactar soporte?',
    a: 'Puedes contactarnos a través del teléfono +57 312 537 0218, correo contacto@certify.com o visitarnos en Bogotá, Colombia.',
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Certify</p>
              <p className="text-xs text-slate-500">Plataforma de Certificación</p>
            </div>
          </Link>
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">Iniciar sesión</Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/" className="mb-6 inline-flex text-sm text-slate-500 hover:text-slate-700 transition-colors">&larr; Volver al inicio</Link>
        <h1 className="text-3xl font-bold text-slate-900">Preguntas Frecuentes</h1>
        <p className="mt-2 text-slate-600">Respuestas a las dudas más comunes sobre Certify.</p>

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

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-3xl px-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Certify. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
