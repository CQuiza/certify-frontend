import { useState } from 'react'
import { toast } from 'sonner'
import { useModuleAssessment, useSubmitAssessment } from '../../../hooks/useModuleAssessments'
import Button from '../../atoms/Button'
import Skeleton from '../../atoms/Skeleton'
import Spinner from '../../atoms/Spinner'
import { getErrorMessage } from '../../../lib/error'
import AssessmentResult from './AssessmentResult'
import type { AnswerSubmission, AttemptResult } from '../../../types/moduleAssessment'

interface AssessmentViewProps {
  moduleId: number
  moduleTitle: string
  onBack?: () => void
}

export default function AssessmentView({ moduleId, moduleTitle, onBack }: AssessmentViewProps) {
  const { data: assessment, isLoading } = useModuleAssessment(moduleId)
  const submitAssessment = useSubmitAssessment()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [confirming, setConfirming] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton count={6} className="h-20 w-full" />
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="p-6 text-center text-slate-500">
        Este módulo no tiene evaluación configurada.
      </div>
    )
  }

  const currentAssessment = assessment

  if (result) {
    return (
      <AssessmentResult
        result={result}
        passingScore={currentAssessment.passing_score}
        moduleTitle={moduleTitle}
        onRetry={() => {
          setResult(null)
          setAnswers({})
        }}
        onBack={onBack}
      />
    )
  }

  function handleSelect(questionId: number, optionId: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  async function handleSubmit() {
    const submissions: AnswerSubmission[] = Object.entries(answers).map(
      ([qId, optId]) => ({ question_id: Number(qId), selected_option_id: optId }),
    )
    try {
      const res = await submitAssessment.mutateAsync({
        assessmentId: currentAssessment.id,
        data: { answers: submissions },
      })
      setResult(res)
      toast.success('Evaluación enviada')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const allAnswered = currentAssessment.questions.every((q) => answers[q.id] !== undefined)
  const unanswered = currentAssessment.questions.filter((q) => answers[q.id] === undefined)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{moduleTitle}</h2>
        <p className="text-sm text-slate-500">
          {currentAssessment.questions.length} preguntas · {currentAssessment.passing_score}% para aprobar
        </p>
      </div>

      <div className="space-y-6">
        {currentAssessment.questions.map((q, idx) => (
          <div key={q.id} className="rounded-lg border border-slate-200 p-5">
            <p className="font-medium text-slate-900 mb-3">
              {idx + 1}. {q.question_text}
              <span className="ml-2 text-xs text-slate-400 font-normal">
                ({q.points} pt{q.points !== 1 ? 's' : ''})
              </span>
            </p>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    answers[q.id] === opt.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleSelect(q.id, opt.id)}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="text-sm text-slate-700">{opt.option_text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {unanswered.length > 0 && (
        <p className="text-sm text-amber-600">
          Faltan {unanswered.length} pregunta{unanswered.length !== 1 ? 's' : ''} por responder.
        </p>
      )}

      <div className="flex gap-3 justify-end">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>Volver</Button>
        )}
        {confirming ? (
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setConfirming(false)}>Cancelar</Button>
            <Button
              onClick={handleSubmit}
              loading={submitAssessment.isPending}
              disabled={!allAnswered}
            >
              {submitAssessment.isPending ? <Spinner size="sm" /> : 'Confirmar envío'}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setConfirming(true)} disabled={!allAnswered}>
            Enviar respuestas
          </Button>
        )}
      </div>
    </div>
  )
}
