import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import {
  useModuleAssessment,
  useUpsertAssessment,
  useDeleteAssessment,
} from '../../../hooks/useModuleAssessments'
import Modal from '../../molecules/Modal'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Skeleton from '../../atoms/Skeleton'
import { getErrorMessage } from '../../../lib/error'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { AssessmentOptionWithCorrect, ModuleAssessmentCreate } from '../../../types/moduleAssessment'

interface AssessmentManagerProps {
  moduleId: number
  onClose: () => void
}

interface QuestionForm {
  question_text: string
  question_type: 'multiple_choice' | 'true_false'
  points: number
  order_index: number
  options: OptionForm[]
}

interface OptionForm {
  option_text: string
  is_correct: boolean
}

function emptyQuestion(type: 'multiple_choice' | 'true_false' = 'multiple_choice'): QuestionForm {
  const opts: OptionForm[] = type === 'true_false'
    ? [{ option_text: 'Verdadero', is_correct: true }, { option_text: 'Falso', is_correct: false }]
    : [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }]
  return { question_text: '', question_type: type, points: 1, order_index: 0, options: opts }
}

export default function AssessmentManager({ moduleId, onClose }: AssessmentManagerProps) {
  const { data: assessment, isLoading } = useModuleAssessment(moduleId)
  const upsertAssessment = useUpsertAssessment()
  const deleteAssessment = useDeleteAssessment()

  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState<QuestionForm[]>([])
  const initialized = useRef(false)

  useEffect(() => {
    if (assessment && !initialized.current) {
      initialized.current = true
      setPassingScore(assessment.passing_score)
      setQuestions(
        assessment.questions.map((q) => ({
          question_text: q.question_text,
          question_type: q.question_type as 'multiple_choice' | 'true_false',
          points: q.points,
          order_index: q.order_index,
          options: q.options.map((o) => ({
            option_text: o.option_text,
            is_correct: 'is_correct' in o ? (o as AssessmentOptionWithCorrect).is_correct : false,
          })),
        })),
      )
    }
  }, [assessment])

  function handleAddQuestion() {
    setQuestions([...questions, emptyQuestion()])
  }

  function handleRemoveQuestion(idx: number) {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  function handleQuestionChange(idx: number, field: keyof QuestionForm, value: unknown) {
    const updated = [...questions]
    if (field === 'question_type' && value !== updated[idx].question_type) {
      updated[idx] = emptyQuestion(value as 'multiple_choice' | 'true_false')
    } else {
      updated[idx] = { ...updated[idx], [field]: value }
    }
    setQuestions(updated)
  }

  function handleOptionChange(
    qIdx: number,
    oIdx: number,
    field: keyof OptionForm,
    value: string | boolean,
  ) {
    const updated = [...questions]
    const opts = [...updated[qIdx].options]
    opts[oIdx] = { ...opts[oIdx], [field]: value }
    if (field === 'is_correct' && value === true && updated[qIdx].question_type === 'multiple_choice') {
      for (let i = 0; i < opts.length; i++) {
        if (i !== oIdx) opts[i] = { ...opts[i], is_correct: false }
      }
    }
    updated[qIdx] = { ...updated[qIdx], options: opts }
    setQuestions(updated)
  }

  function handleAddOption(qIdx: number) {
    const updated = [...questions]
    if (updated[qIdx].options.length >= 4) return
    updated[qIdx] = {
      ...updated[qIdx],
      options: [...updated[qIdx].options, { option_text: '', is_correct: false }],
    }
    setQuestions(updated)
  }

  function handleRemoveOption(qIdx: number, oIdx: number) {
    const updated = [...questions]
    const opts = updated[qIdx].options.filter((_, i) => i !== oIdx)
    updated[qIdx] = { ...updated[qIdx], options: opts }
    setQuestions(updated)
  }

  async function handleSave() {
    const data: ModuleAssessmentCreate = {
      passing_score: passingScore,
      questions: questions.map((q, i) => ({
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        order_index: i,
        options: q.options.map((o) => ({
          option_text: o.option_text,
          is_correct: o.is_correct,
        })),
      })),
    }
    try {
      await upsertAssessment.mutateAsync({ moduleId, data })
      toast.success('Evaluación guardada correctamente')
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleDelete() {
    if (!assessment) return
    try {
      await deleteAssessment.mutateAsync(assessment.id)
      toast.success('Evaluación eliminada')
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="Configurar evaluación" size="lg">
      {isLoading ? (
        <div className="space-y-3"><Skeleton count={4} className="h-12 w-full" /></div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Puntaje mínimo para aprobar (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-semibold text-indigo-600 w-10 text-right">{passingScore}%</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Preguntas</h3>
              <Button onClick={handleAddQuestion} size="sm">
                <Plus className="h-4 w-4" />Agregar pregunta
              </Button>
            </div>

            {questions.length === 0 && (
              <p className="text-sm text-slate-500">No hay preguntas. Agrega al menos una.</p>
            )}

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <GripVertical className="h-4 w-4 text-slate-300" />
                    Pregunta {qIdx + 1}
                  </div>
                  <button
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Input
                      label="Texto de la pregunta"
                      value={q.question_text}
                      onChange={(e) => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                      placeholder="Ej: ¿Cuál es...?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
                    <select
                      value={q.question_type}
                      onChange={(e) => handleQuestionChange(qIdx, 'question_type', e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="multiple_choice">Opción múltiple</option>
                      <option value="true_false">Verdadero/Falso</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Puntos</label>
                  <input
                    type="number"
                    min={1}
                    value={q.points}
                    onChange={(e) => handleQuestionChange(qIdx, 'points', Number(e.target.value))}
                    className="block w-24 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Opciones</label>
                  {q.options.map((o, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type={q.question_type === 'multiple_choice' ? 'radio' : 'radio'}
                        name={`correct-${qIdx}`}
                        checked={o.is_correct}
                        onChange={() => handleOptionChange(qIdx, oIdx, 'is_correct', true)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <input
                        type="text"
                        value={o.option_text}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, 'option_text', e.target.value)}
                        placeholder="Texto de la opción"
                        className="block flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {q.question_type === 'multiple_choice' && q.options.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(qIdx, oIdx)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {q.question_type === 'multiple_choice' && q.options.length < 4 && (
                    <button
                      onClick={() => handleAddOption(qIdx)}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      + Agregar opción
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-slate-200 pt-4">
            {assessment && (
              <Button variant="danger" onClick={handleDelete} loading={deleteAssessment.isPending}>
                Eliminar evaluación
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleSave} loading={upsertAssessment.isPending}>
                {assessment ? 'Guardar cambios' : 'Crear evaluación'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
