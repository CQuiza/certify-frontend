import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moduleAssessmentService } from '../services/moduleAssessmentService'
import type { ModuleAssessmentCreate, AssessmentSubmit } from '../types/moduleAssessment'

export function useModuleAssessment(moduleId: number) {
  return useQuery({
    queryKey: ['module-assessment', moduleId],
    queryFn: () => moduleAssessmentService.getByModule(moduleId),
    enabled: moduleId > 0,
  })
}

export function useUpsertAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: number; data: ModuleAssessmentCreate }) =>
      moduleAssessmentService.upsert(moduleId, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['module-assessment', vars.moduleId] })
    },
  })
}

export function useDeleteAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (assessmentId: number) => moduleAssessmentService.remove(assessmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['module-assessment'] })
    },
  })
}

export function useSubmitAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      assessmentId,
      data,
    }: {
      assessmentId: number
      data: AssessmentSubmit
    }) => moduleAssessmentService.submit(assessmentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progress-summary'] })
    },
  })
}

export function useAssessmentAttempts(assessmentId: number) {
  return useQuery({
    queryKey: ['assessment-attempts', assessmentId],
    queryFn: () => moduleAssessmentService.getAttempts(assessmentId),
    enabled: assessmentId > 0,
  })
}

export function useCourseProgressSummary(courseId: number, userId?: number) {
  return useQuery({
    queryKey: ['progress-summary', 'course', courseId, userId],
    queryFn: () => moduleAssessmentService.getCourseProgress(courseId, userId),
    enabled: courseId > 0,
  })
}

export function useAllProgressSummaries(userId?: number) {
  return useQuery({
    queryKey: ['progress-summary', 'all', userId],
    queryFn: () => moduleAssessmentService.getAllSummaries(userId),
  })
}
