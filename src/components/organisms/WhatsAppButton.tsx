import { usePlatform } from '../../hooks/usePlatform'
import { waLink } from '../../types/course'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const { contactPhone } = usePlatform()
  const href = waLink(contactPhone, 'Hola, quiero información sobre los cursos.')
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors"
      title="Consultar con un asesor"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}