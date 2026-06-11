import Button from '../../atoms/Button'
import type { AttemptResult } from '../../../types/moduleAssessment'

interface AssessmentResultProps {
  result: AttemptResult
  passingScore: number
  moduleTitle: string
  onRetry: () => void
  onBack?: () => void
}

export default function AssessmentResult({
  result,
  passingScore,
  moduleTitle,
  onRetry,
  onBack,
}: AssessmentResultProps) {
  const passed = result.passed
  const pct = Math.round(result.score)

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">{moduleTitle}</h2>
        <p className="text-sm text-slate-500">Resultado de la evaluación</p>
      </div>

      <div className="flex flex-col items-center gap-2 py-6">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="15.5"
              fill="none" stroke="#e2e8f0" strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              stroke={passed ? '#22c55e' : '#ef4444'}
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {pct}%
            </span>
          </div>
        </div>
        <p className={`text-lg font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {passed ? 'Aprobado' : 'Reprobado'}
        </p>
        <p className="text-sm text-slate-500">
          {result.earned_points} / {result.total_points} puntos
          {!passed && ` (mínimo ${passingScore}%)`}
        </p>
      </div>

      {passed && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
          <p className="text-sm font-medium text-green-800">
            Felicidades Has aprobado este módulo.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700">Detalle de respuestas</h3>
        {result.answers.map((a) => (
          <div
            key={a.question_id}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              a.is_correct
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                a.is_correct ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {a.is_correct ? '✓' : '✗'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{a.question_text}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {a.is_correct ? 'Respuesta correcta' : 'Respuesta incorrecta'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>Volver al curso</Button>
        )}
        {!passed && (
          <Button onClick={onRetry}>Intentar de nuevo</Button>
        )}
      </div>
    </div>
  )
}
