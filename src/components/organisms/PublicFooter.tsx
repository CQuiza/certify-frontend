import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { config } from '../../config'
import { usePublicBranding } from '../../hooks/useConfiguration'

interface PublicFooterProps {
  showDeveloper?: boolean
}

export default function PublicFooter({ showDeveloper = false }: PublicFooterProps) {
  const { data: pub } = usePublicBranding()
  const contactPhone = pub?.contact_phone || config.contactPhone
  const contactEmail = pub?.contact_email || config.contactEmail

  return (
    <footer className="border-t border-white/10 bg-slate-900 py-12 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="text-lg font-bold tracking-tight text-white">Acreditapp</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            La infraestructura tecnológica para gestionar, vender y certificar tus
            capacitaciones corporativas.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Producto</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/catalog" className="transition-colors hover:text-white">Catálogo de cursos</Link>
            </li>
            <li>
              <Link to="/search" className="transition-colors hover:text-white">Verificar certificado</Link>
            </li>
            <li>
              <Link to="/register" className="transition-colors hover:text-white">Probar Acreditapp</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Recursos</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/faq" className="transition-colors hover:text-white">Preguntas frecuentes</Link>
            </li>
            <li>
              <Link to="/login" className="transition-colors hover:text-white">Iniciar sesión</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{contactPhone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
              <span className="break-all">{contactEmail}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{config.cityCountry}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-6 pt-6">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Acreditapp. Todos los derechos reservados.
          </p>
          {showDeveloper && (
            <a
              href="https://cristhianquiza.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
            >
              <span className="text-[11px] text-slate-500">Desarrollado por:</span>
              <img src="/cristhianquiza-logo.svg" alt="Cristhian Quiza" className="h-8 w-auto" />
              <span className="text-[11px] font-medium text-slate-300">cristhianquiza.com</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
