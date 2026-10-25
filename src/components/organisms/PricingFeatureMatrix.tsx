import { Fragment } from 'react'
import { Check } from 'lucide-react'

export interface FeatureRow {
  feature: string
  monthly: string | boolean
  semestral: string | boolean
  annual: string | boolean
}

export interface FeatureCategory {
  title: string
  items: FeatureRow[]
}

interface PricingFeatureMatrixProps {
  categories: FeatureCategory[]
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-emerald-400" aria-label="Incluido" />
  }
  if (value === false) {
    return <span className="text-xs text-slate-500">—</span>
  }

  const highlighted = /gratis|vip/i.test(value)
  return (
    <span className={`text-xs ${highlighted ? 'font-medium text-emerald-300' : 'text-slate-400'}`}>
      {value}
    </span>
  )
}

export default function PricingFeatureMatrix({ categories }: PricingFeatureMatrixProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-700/80 bg-slate-900/60 backdrop-blur-md">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900/80">
            <th
              scope="col"
              className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Característica
            </th>
            <th
              scope="col"
              className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Mensual
            </th>
            <th
              scope="col"
              className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Semestral
            </th>
            <th
              scope="col"
              className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-emerald-300"
            >
              Anual
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <Fragment key={category.title}>
              <tr>
                <th
                  colSpan={4}
                  scope="colgroup"
                  className="bg-slate-800/50 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-emerald-300"
                >
                  {category.title}
                </th>
              </tr>
              {category.items.map((item) => (
                <tr key={item.feature} className="border-t border-slate-800/70">
                  <th scope="row" className="px-5 py-3 text-left font-normal text-slate-300">
                    {item.feature}
                  </th>
                  <td className="px-5 py-3 text-center">
                    <Cell value={item.monthly} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Cell value={item.semestral} />
                  </td>
                  <td className="bg-emerald-400/[0.03] px-5 py-3 text-center">
                    <Cell value={item.annual} />
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
