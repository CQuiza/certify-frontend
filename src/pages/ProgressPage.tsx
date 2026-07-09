import { useState, useEffect, useMemo, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAllProgressSummaries } from '../hooks/useModuleAssessments'
import { useUsers, useUser } from '../hooks/useUsers'
import { taskSubmissionService } from '../services/taskSubmissionService'
import Card from '../components/molecules/Card'
import Skeleton from '../components/atoms/Skeleton'
import Button from '../components/atoms/Button'
import { Search, ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle, X, FileText, Loader2 } from 'lucide-react'
import type { User } from '../types'

export default function ProgressPage() {
  const { user } = useAuth()
  const canSearch = !!(user && ['superuser', 'admin', 'teacher'].includes(user.role))

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)
  const [downloading, setDownloading] = useState<number | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(searchTimer.current)
  }, [searchQuery])

  const hasActiveSearch = debouncedSearch.length >= 2

  const { data: searchResults } = useUsers(
    hasActiveSearch ? { search: debouncedSearch, limit: 500 } : undefined,
    { enabled: canSearch && hasActiveSearch },
  )

  const { data: selectedUserData } = useUser(selectedUser?.id ?? 0)

  const { data: progress, isLoading } = useAllProgressSummaries(
    canSearch ? selectedUser?.id : undefined,
  )

  function isModuleComplete(mod: { passed: boolean; total_assessment_questions: number; total_tasks: number; submitted_tasks: number }): boolean {
    const assessmentOk = mod.total_assessment_questions === 0 || mod.passed
    const tasksOk = mod.total_tasks === 0 || mod.submitted_tasks === mod.total_tasks
    return assessmentOk && tasksOk
  }

  async function handleDownload(submissionId: number, preferredName?: string) {
    setDownloading(submissionId)
    try {
      await taskSubmissionService.downloadFile(submissionId, preferredName)
    } catch {
      // silent
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Progreso</h1>
      </div>

      {canSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar alumno por nombre o email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery.length >= 2 && showResults && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
              {!searchResults?.items?.length ? (
                <p className="px-4 py-3 text-sm text-slate-500">Sin resultados</p>
              ) : (
                searchResults?.items?.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u)
                      setSearchQuery(`${u.name} ${u.first_last_name ?? ''}`)
                      setShowResults(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{u.name} {u.first_last_name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
          {selectedUser && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2">
              <span className="text-sm font-medium text-indigo-700">
                Mostrando progreso de: {selectedUser.name} {selectedUser.first_last_name}
              </span>
              <button
                onClick={() => { setSelectedUser(null); setSearchQuery('') }}
                className="rounded-lg p-0.5 text-indigo-400 hover:text-indigo-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4"><Skeleton count={3} className="h-24 w-full" /></div>
      ) : !progress || progress.courses.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-slate-500">
            No hay progreso disponible.
          </p>
        </Card>
      ) : (
        <>
          <div className={`rounded-lg border p-4 ${progress.overall_percent === 100 ? 'bg-emerald-50 border-emerald-200' : 'bg-indigo-50 border-indigo-200'}`}>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-800">Progreso global</span>
                  <span className="text-sm font-bold text-slate-800">{progress.overall_percent}%</span>
                </div>
                <div className={`h-2.5 w-full rounded-full ${progress.overall_percent === 100 ? 'bg-emerald-200' : 'bg-indigo-200'}`}>
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${progress.overall_percent === 100 ? 'bg-emerald-600' : 'bg-indigo-600'}`}
                    style={{ width: `${progress.overall_percent}%` }}
                  />
                </div>
                {progress.overall_percent === 100 && (
                  <p className="mt-1 text-xs font-medium text-emerald-700">
                    Completaste todos los requisitos del curso
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {progress.courses.map((course) => {
              const expanded = expandedCourse === course.course_id
              return (
                <Card key={course.course_id} padding={false}>
                  <button
                    onClick={() => setExpandedCourse(expanded ? null : course.course_id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{course.course_title}</h3>
                        {expanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${course.progress_percent}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-600 shrink-0">
                          {course.completed_modules}/{course.total_modules} módulos
                        </span>
                        <span className="text-xs font-bold text-emerald-600 shrink-0">
                          {course.progress_percent}%
                        </span>
                      </div>
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100">
                      {course.modules.map((mod) => {
                        const modComplete = isModuleComplete(mod)
                        return (
                          <div key={mod.module_id}>
                            <div className="flex items-center justify-between px-5 py-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {modComplete ? (
                                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                                ) : (
                                  <Clock className="h-5 w-5 shrink-0 text-amber-500" />
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-800 truncate">{mod.module_title}</p>
                                  <div className="text-xs text-slate-500 space-y-0.5">
                                    {mod.total_assessment_questions > 0 && (
                                      <p>
                                        Evaluación: {mod.passed ? `Aprobado · ${mod.last_score ?? '-'}% · ${mod.attempts_count} intento${mod.attempts_count !== 1 ? 's' : ''}` : `${mod.last_score != null ? `${mod.last_score}% · ` : ''}${mod.attempts_count} intento${mod.attempts_count !== 1 ? 's' : ''}`}
                                      </p>
                                    )}
                                    {mod.total_tasks > 0 && (
                                      <p className={mod.submitted_tasks === mod.total_tasks ? 'text-emerald-600' : 'text-amber-600'}>
                                        Tareas: {mod.submitted_tasks}/{mod.total_tasks} entregadas
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {modComplete ? (
                                <span className="text-xs font-medium text-emerald-600 shrink-0">Completado</span>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => window.location.href = `/courses/${course.course_id}`}
                                >
                                  Ir al curso
                                </Button>
                              )}
                            </div>
                            {mod.tasks && mod.tasks.length > 0 && (
                              <div className="border-t border-slate-50 bg-slate-50/50 px-5 py-2 space-y-1.5">
                                {mod.tasks.map((t) => (
                                  <div key={t.task_id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                      <span className="text-slate-700 truncate">{t.task_title}</span>
                                      {t.submitted ? (
                                        <span className="text-emerald-600 font-medium shrink-0">Entregado</span>
                                      ) : (
                                        <span className="text-amber-600 font-medium shrink-0">No entregado</span>
                                      )}
                                    </div>
                                    {t.submitted && t.submission_id && (
                                      <button
                                        onClick={() => handleDownload(t.submission_id!, t.original_filename || undefined)}
                                        disabled={downloading === t.submission_id}
                                        className="flex items-center gap-1 shrink-0 rounded bg-white border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                      >
                                        {downloading === t.submission_id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <FileText className="h-3 w-3" />
                                        )}
                                        {downloading === t.submission_id ? 'Descargando...' : 'Descargar'}
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {mod.submitted_tasks < mod.total_tasks && (
                                  <p className="text-xs text-amber-600 pt-1">
                                    Debes completar todas las tareas para finalizar el curso.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
