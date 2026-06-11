import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAllProgressSummaries } from '../hooks/useModuleAssessments'
import { useUsers } from '../hooks/useUsers'
import Card from '../components/molecules/Card'
import Skeleton from '../components/atoms/Skeleton'
import Button from '../components/atoms/Button'
import { Search, ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle, X } from 'lucide-react'
import type { User } from '../types'

export default function ProgressPage() {
  const { user } = useAuth()
  const canSearch = user && ['superuser', 'admin', 'teacher'].includes(user.role)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)

  const { data: allUsers } = useUsers(
    { role: 'student', limit: 500 },
    { enabled: canSearch },
  )

  const filteredUsers = useMemo(() => {
    if (!canSearch || !allUsers) return []
    const q = searchQuery.toLowerCase()
    return (allUsers as User[]).filter(
      (u) =>
        u.role === 'student' &&
        (u.name?.toLowerCase().includes(q) ||
          u.first_last_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)),
    )
  }, [allUsers, searchQuery, canSearch])

  const { data: progress, isLoading } = useAllProgressSummaries(
    canSearch ? selectedUser?.id : undefined,
  )

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
              {filteredUsers.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">Sin resultados</p>
              ) : (
                filteredUsers.map((u) => (
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
          <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-indigo-800">Progreso global</span>
                  <span className="text-sm font-bold text-indigo-800">{progress.overall_percent}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-indigo-200">
                  <div
                    className="h-2.5 rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${progress.overall_percent}%` }}
                  />
                </div>
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
                      {course.modules.map((mod) => (
                        <div key={mod.module_id} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {mod.passed ? (
                              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                            ) : mod.total_assessment_questions > 0 ? (
                              <Clock className="h-5 w-5 shrink-0 text-amber-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 shrink-0 text-slate-300" />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{mod.module_title}</p>
                              <p className="text-xs text-slate-500">
                                {mod.total_assessment_questions === 0
                                  ? 'Sin evaluar'
                                  : mod.passed
                                    ? `Aprobado · ${mod.last_score ?? '-'}% · ${mod.attempts_count} intento${mod.attempts_count !== 1 ? 's' : ''}`
                                    : `${mod.last_score != null ? `${mod.last_score}% · ` : ''}${mod.attempts_count} intento${mod.attempts_count !== 1 ? 's' : ''}`}
                              </p>
                            </div>
                          </div>
                          {!mod.passed && mod.total_assessment_questions > 0 && (
                            <Button
                              size="sm"
                              onClick={() => window.location.href = `/courses/${course.course_id}`}
                            >
                              Tomar evaluación
                            </Button>
                          )}
                          {mod.passed && (
                            <span className="text-xs font-medium text-emerald-600 shrink-0">Aprobado</span>
                          )}
                        </div>
                      ))}
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
