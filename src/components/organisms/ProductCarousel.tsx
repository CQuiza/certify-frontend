import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    src: '/carrete/carrete1_verificacion.png',
    alt: 'Verificación pública de certificados',
  },
  {
    src: '/carrete/carrete2_catalogo.png',
    alt: 'Catálogo de cursos',
  },
  {
    src: '/carrete/carrete3_dashboard.png',
    alt: 'Dashboard de la plataforma',
  },
  {
    src: '/carrete/carrete4_certificados.png',
    alt: 'Gestión de certificados',
  },
  {
    src: '/carrete/carrete5_progreso.png',
    alt: 'Seguimiento de progreso',
  },
  {
    src: '/carrete/carrete6_tipos_certificados.png',
    alt: 'Tipos de certificados',
  },
  {
    src: '/carrete/carrete7_auditoria.png',
    alt: 'Auditoría de certificados',
  },
]

export default function ProductCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [paused])

  function openPreview() {
    setPreviewOpen(true)
    setPaused(true)
  }

  function closePreview() {
    setPreviewOpen(false)
    setPaused(false)
  }

  function goTo(next: number) {
    setIndex((next + SLIDES.length) % SLIDES.length)
  }

  return (
    <div
      className="relative mx-auto w-full max-w-xl"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Vista previa de la plataforma"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-2 shadow-2xl backdrop-blur">
        <div className="overflow-hidden rounded-xl bg-white">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.src}
                className="w-full shrink-0 overflow-hidden"
                onMouseEnter={openPreview}
                onMouseLeave={closePreview}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="aspect-[2.06/1] w-full cursor-zoom-in object-cover object-top"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <div className="flex flex-1 items-center gap-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la imagen ${i + 1}: ${slide.alt}`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Imagen anterior"
              className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Imagen siguiente"
              className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <img
            src={SLIDES[index].src}
            alt=""
            aria-hidden="true"
            className="max-h-[82vh] max-w-[92vw] animate-zoom-pop rounded-2xl border border-white/15 bg-white object-contain shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
            draggable={false}
          />
        </div>
      )}
    </div>
  )
}
