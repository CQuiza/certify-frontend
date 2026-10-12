import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskSubmissionService } from '../services/taskSubmissionService'
import type { GradeRequest } from '../types'

export function useSubmitTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: number; file: File }) =>
      taskSubmissionService.submit(taskId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task-submissions'] })
      qc.invalidateQueries({ queryKey: ['progress-summary'] })
    },
  })
}

export function useTaskSubmissions(taskId: number) {
  return useQuery({
    queryKey: ['task-submissions', 'list', taskId],
    queryFn: () => taskSubmissionService.listByTask(taskId),
    enabled: taskId > 0,
  })
}

export function useMyTaskSubmission(taskId: number) {
  return useQuery({
    queryKey: ['task-submissions', 'my', taskId],
    queryFn: () => taskSubmissionService.getMySubmission(taskId),
    enabled: taskId > 0,
  })
}

export function useGradeSubmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ submissionId, payload }: { submissionId: number; payload: GradeRequest }) =>
      taskSubmissionService.grade(submissionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task-submissions'] })
      qc.invalidateQueries({ queryKey: ['reports-catalog'] })
    },
  })
}
