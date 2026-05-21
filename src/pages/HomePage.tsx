import { Award, GraduationCap, Users, FileCheck, Shield, Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Certify</p>
              <p className="text-xs text-slate-500">Plataforma de Certificación</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Iniciar sesión</Link>
            <Link to="/login" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">Registrarse</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 lg:text-5xl">Plataforma de Certificación Profesional</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Gestiona, emite y verifica certificados académicos y profesionales de forma segura, rápida y centralizada.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/login" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">Comenzar ahora</Link>
          <a href="#services" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Ver servicios</a>
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
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-sm">
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

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">Contacto</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">Estamos aquí para ayudarte</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {[
              { icon: Phone, label: '+57 312 537 0218' },
              { icon: Mail, label: 'contacto@certify.com' },
              { icon: MapPin, label: 'Bogotá, Colombia' },
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
          <Link to="/faq" className="text-indigo-600 hover:text-indigo-700 transition-colors">Preguntas frecuentes</Link>
          <span className="mx-3 text-slate-300">·</span>
          &copy; {new Date().getFullYear()} Certify. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
