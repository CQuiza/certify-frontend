import api from './api'
import type { TaskSubmission, TaskSubmissionWithUser } from '../types'

export const taskSubmissionService = {
  submit: async (taskId: number, file: File): Promise<TaskSubmission> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<TaskSubmission>(`/tasks/${taskId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  listByTask: async (taskId: number): Promise<TaskSubmissionWithUser[]> => {
    const { data } = await api.get<TaskSubmissionWithUser[]>(`/tasks/${taskId}/submissions`)
    return data
  },

  getMySubmission: async (taskId: number): Promise<TaskSubmission | null> => {
    const { data } = await api.get<TaskSubmission | null>(`/tasks/${taskId}/my-submission`)
    return data
  },

  getFileUrl: (submissionId: number): string => {
    return `/submissions/${submissionId}/file`
  },

  downloadFile: async (submissionId: number, preferredName?: string): Promise<void> => {
    const res = await fetch(api.defaults.baseURL + `/submissions/${submissionId}/file`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error()
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = preferredName || `submission-${submissionId}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  },
}
