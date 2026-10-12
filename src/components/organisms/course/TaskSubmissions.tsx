import { useState } from 'react'
import { toast } from 'sonner'
import { useTaskSubmissions, useGradeSubmission } from '../../../hooks/useTaskSubmissions'
import { taskSubmissionService } from '../../../services/taskSubmissionService'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Badge from '../../atoms/Badge'
import { Download, Star } from 'lucide-react'
import { formatDate } from '../../../lib/dates'
import { getErrorMessage } from '../../../lib/error'
import type { TaskSubmissionWithUser } from '../../../types'

interface Props {
  taskId: number
}

export default function TaskSubmissions({ taskId }: Props) {
  const { data: submissions, isLoading } = useTaskSubmissions(taskId)
  const grade = useGradeSubmission()
  const [gradingId, setGradingId] = useState<number | null>(null)
  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')

  function openGrade(s: TaskSubmissionWithUser) {
    setGradingId(s.id)
    setScore(s.score != null ? String(s.score) : '')
    setFeedback(s.feedback ?? '')
  }

  async function handleSaveGrade() {
    if (gradingId == null) return
    const parsed = Number(score)
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
      toast.error('La nota debe estar entre 0 y 100')
      return
    }
    try {
      await grade.mutateAsync({
        submissionId: gradingId,
        payload: { score: parsed, feedback: feedback || null },
      })
      toast.success('Entrega calificada')
      setGradingId(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isLoading) {
    return <p className="text-xs text-slate-500">Cargando entregas...</p>
  }
  if (!submissions || submissions.length === 0) {
    return <p className="text-xs text-slate-500">Aún no hay entregas para esta tarea.</p>
  }

  return (
    <div className="space-y-2">
      {submissions.map((s) => (
        <div key={s.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{`${s.user_name || ''} ${s.user_email || ''}`.trim()}</p>
              <p className="text-xs text-slate-500">
                Entregado {formatDate(s.submitted_at)}
                {s.graded_at ? ` · calificado por ${s.grader_name || '—'} (${formatDate(s.graded_at)})` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {s.score != null && (
                <Badge variant={s.passed ? 'success' : 'warning'}>
                  Nota: {s.score}
                </Badge>
              )}
              <button
                onClick={() => taskSubmissionService.downloadFile(s.id, s.original_filename).catch(() => toast.error('No se pudo descargar'))}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                title="Descargar entrega"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => openGrade(s)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                title="Calificar"
              >
                <Star className="h-4 w-4" />
              </button>
            </div>
          </div>
          {s.feedback && <p className="mt-1 text-xs text-slate-600">Feedback: {s.feedback}</p>}

          {gradingId === s.id && (
            <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input label="Nota (0-100)" type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Feedback</label>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setGradingId(null)}>Cancelar</Button>
                <Button size="sm" onClick={handleSaveGrade} loading={grade.isPending}>Guardar nota</Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}