import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonFileService } from '../services/lessonFileService'
import type { LessonFileCreate } from '../types'

export function useLessonFilesByLesson(lessonId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['lessonFiles', 'lesson', lessonId],
    queryFn: () => lessonFileService.listByLesson(lessonId),
    enabled: lessonId > 0 && (options?.enabled ?? true),
  })
}

export function useCreateLessonFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: number; data: LessonFileCreate }) =>
      lessonFileService.create(lessonId, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['lessonFiles', 'lesson', res.lesson_id] })
    },
  })
}

export function useUploadLessonFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, fileId, file }: { lessonId: number; fileId: number; file: File }) =>
      lessonFileService.uploadFile(lessonId, fileId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessonFiles'] })
    },
  })
}

export function useDeleteLessonFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, fileId }: { lessonId: number; fileId: number }) =>
      lessonFileService.remove(lessonId, fileId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessonFiles'] })
    },
  })
}
