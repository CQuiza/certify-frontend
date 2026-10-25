import type { ReactNode } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export interface PricingPlan {
  id: string
  title: string
  tagline: string
  price: string
  billed: string
  badge?: string
  features: ReactNode[]
  cta: string
  variant: 'secondary' | 'primary' | 'featured'
}

interface PricingCardProps {
  plan: PricingPlan
  onSelect: (plan: PricingPlan) => void
}

const buttonStyles: Record<PricingPlan['variant'], string> = {
  secondary:
    'border border-slate-600 bg-slate-900/40 text-slate-100 hover:border-slate-500 hover:bg-slate-800',
  primary:
    'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500',
  featured:
    'bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110',
}

export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  const featured = plan.variant === 'featured'

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-6 backdrop-blur-md transition-all duration-300 sm:p-7 ${
        featured
          ? 'border-emerald-500/50 bg-slate-800/60 shadow-[0_0_60px_-15px_rgba(16,185,129,0.65)] lg:-translate-y-3'
          : 'border-slate-700/80 bg-slate-800/40 hover:border-slate-600'
      }`}
    >
      {plan.badge && (
        <span
          className={`absolute -top-3 left-1/2 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full px-3 py-1 text-center text-[11px] font-semibold leading-tight ring-1 ${
            featured
              ? 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/40'
              : 'bg-amber-400/15 text-amber-300 ring-amber-400/40'
          }`}
        >
          {plan.badge}
        </span>
      )}

      <h3 className="font-display text-xl font-bold text-white">{plan.title}</h3>
      <p className="mt-2 min-h-[72px] text-sm leading-relaxed text-slate-400">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {plan.price}
        </span>
        <span className="text-sm text-slate-400">/ mes</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{plan.billed}</p>

      <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${buttonStyles[plan.variant]}`}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
