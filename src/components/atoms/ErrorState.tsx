import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  className?: string
}

export default function ErrorState({ message = 'Ocurrió un error al cargar los datos. Inténtalo de nuevo.', className = '' }: ErrorStateProps) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 ${className}`}>
      <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  )
}