interface DeveloperCreditProps {
  tone?: 'light' | 'dark'
  className?: string
}

export default function DeveloperCredit({ tone = 'light', className = '' }: DeveloperCreditProps) {
  const labelClass = tone === 'dark' ? 'text-slate-500' : 'text-slate-400'
  const nameClass = tone === 'dark' ? 'text-slate-300' : 'text-slate-600'

  return (
    <a
      href="https://cristhianquiza.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center gap-1 transition-opacity hover:opacity-80 ${className}`}
    >
      <span className={`text-[11px] ${labelClass}`}>Desarrollado por:</span>
      <img src="/cristhianquiza-logo.svg" alt="Cristhian Quiza" className="h-8 w-auto" />
      <span className={`text-[11px] font-medium ${nameClass}`}>cristhianquiza.com</span>
    </a>
  )
}
