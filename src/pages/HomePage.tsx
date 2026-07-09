import { Award, GraduationCap, Users, FileCheck, Shield, Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { config } from '../config'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <img src="/certify_logo.png" alt="Certify" className="h-20 w-auto" />
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Verificar certificado</Link>
            <Link to="/catalog" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Catálogo</Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Iniciar sesión</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-slate-900 lg:text-5xl">{config.appDescription} Profesional</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 lg:mx-0">
              Gestiona, emite y verifica certificados académicos y profesionales de forma segura, rápida y centralizada.
            </p>
            <div className="mt-8 flex justify-center gap-4 lg:justify-start">
              <Link to="/search" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">Verificar certificado</Link>
              <Link to="/catalog" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Ver cursos</Link>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
              alt="Estudiantes"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">Nuestros Servicios</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">Todo lo que necesitas para gestionar certificaciones</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Award, title: 'Emisión de Certificados', desc: 'Genera certificados digitales con códigos QR únicos y verificación en línea.' },
              { icon: Users, title: 'Gestión de Usuarios', desc: 'Administra estudiantes, docentes y administradores con roles y permisos.' },
              { icon: GraduationCap, title: 'Cursos y Módulos', desc: 'Crea cursos con módulos y lecciones, asigna docentes y gestiona el contenido.' },
              { icon: FileCheck, title: 'Tipos de Certificado', desc: 'Define múltiples tipos con duración, horas y vigencia personalizables.' },
              { icon: Shield, title: 'Verificación Segura', desc: 'Cada certificado incluye un UUID único y código QR para verificación pública.' },
              { icon: Award, title: 'Auditoría Completa', desc: 'Registro detallado de todas las acciones realizadas sobre los certificados.' },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row-reverse lg:items-center">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900">Certificaciones con Validez Oficial</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600 leading-relaxed lg:mx-0">
                Cada certificado emitido incluye un código UUID único y un código QR que permite su verificación
                pública en línea. Olvídate de documentos falsos — cualquier persona puede comprobar la autenticidad
                de un certificado en segundos desde nuestro portal de verificación.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"
                alt="Certificado digital"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">Contacto</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">Estamos aquí para ayudarte</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {[
              { icon: Phone, label: config.contactPhone },
              { icon: Mail, label: config.contactEmail },
              { icon: MapPin, label: config.cityCountry },
            ].map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4">
                  <Icon className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm text-slate-700">{c.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          <Link to="/search" className="text-indigo-600 hover:text-indigo-700 transition-colors">Verificar certificado</Link>
          <span className="mx-3 text-slate-300">·</span>
          <Link to="/catalog" className="text-indigo-600 hover:text-indigo-700 transition-colors">Catálogo</Link>
          <span className="mx-3 text-slate-300">·</span>
          <Link to="/faq" className="text-indigo-600 hover:text-indigo-700 transition-colors">Preguntas frecuentes</Link>
          <span className="mx-3 text-slate-300">·</span>
          &copy; {new Date().getFullYear()} {config.appName}. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
