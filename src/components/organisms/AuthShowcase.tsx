import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { config } from '../../config'

interface Slide {
  title: string
  desc: string
  developer?: boolean
}

const SLIDES: Slide[] = [
  {
    title: 'La infraestructura para certificar',
    desc: 'Gestiona cursos, usuarios y certificados de forma centralizada y segura.',
  },
  {
    title: 'Espacios white-label por organización',
    desc: 'Cada cliente con su propia marca, subdominio y datos totalmente aislados.',
  },
  {
    title: 'Certificados verificables con QR',
    desc: 'Emisión y validación pública inmediata con identificadores únicos.',
  },
  {
    title: 'Vende tus capacitaciones en línea',
    desc: 'Catálogo con carrito y pago integrado para la venta autónoma de cursos.',
  },
  {
    title: 'Evaluaciones y progreso en tiempo real',
    desc: 'Módulos, tareas, evaluaciones y seguimiento del estudiante de principio a fin.',
  },
  { title: 'Desarrollado por', desc: '', developer: true },
]

export default function AuthShowcase() {
  const brand = config.appName
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (paused) return
    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer.current)
  }, [paused])

  return (
    <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-slate-900 lg:flex">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 60% at 20% 20%, rgba(16,185,129,0.32) 0%, rgba(15,23,42,0) 60%), radial-gradient(50% 50% at 80% 80%, rgba(6,182,212,0.22) 0%, rgba(15,23,42,0) 60%)',
        }}
      />
      <div
        className="relative w-full max-w-md px-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((s, i) => (
              <div
                key={i}
                className="flex min-h-[240px] w-full shrink-0 flex-col items-center justify-center px-1 text-center text-white"
              >
                {s.developer ? (
                  <a
                    href="https://cristhianquiza.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <span className="text-base text-slate-300">Desarrollado por:</span>
                    <img src="/cristhianquiza-logo.svg" alt="Cristhian Quiza" className="h-20 w-auto" />
                    <span className="text-base font-semibold text-slate-100">cristhianquiza.com</span>
                  </a>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      {brand}
                    </span>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight">{s.title}</h2>
                    <p className="mt-3 text-lg text-slate-300">{s.desc}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir al mensaje ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
