import api from './api'
import type {
  ModuleAssessment,
  ModuleAssessmentTeacher,
  ModuleAssessmentCreate,
  AssessmentSubmit,
  AttemptResult,
  AttemptRead,
  CourseProgressSummary,
  AllProgressSummary,
} from '../types/moduleAssessment'

export const moduleAssessmentService = {
  getByModule: async (moduleId: number): Promise<ModuleAssessment | ModuleAssessmentTeacher> => {
    const { data } = await api.get<ModuleAssessment | ModuleAssessmentTeacher>(
      `/modules/${moduleId}/assessment`,
    )
    return data
  },

  upsert: async (moduleId: number, payload: ModuleAssessmentCreate): Promise<ModuleAssessmentTeacher> => {
    const { data } = await api.post<ModuleAssessmentTeacher>(
      `/modules/${moduleId}/assessment`,
      payload,
    )
    return data
  },

  remove: async (assessmentId: number): Promise<void> => {
    await api.delete(`/assessments/${assessmentId}`)
  },

  submit: async (assessmentId: number, payload: AssessmentSubmit): Promise<AttemptResult> => {
    const { data } = await api.post<AttemptResult>(
      `/assessments/${assessmentId}/submit`,
      payload,
    )
    return data
  },

  getAttempts: async (assessmentId: number): Promise<AttemptRead[]> => {
    const { data } = await api.get<AttemptRead[]>(`/assessments/${assessmentId}/attempts`)
    return data
  },

  getCourseProgress: async (courseId: number, userId?: number): Promise<CourseProgressSummary> => {
    const params = userId ? { user_id: userId } : undefined
    const { data } = await api.get<CourseProgressSummary>(
      `/user-progress/summary/${courseId}`,
      { params },
    )
    return data
  },

  getAllSummaries: async (userId?: number): Promise<AllProgressSummary> => {
    const params = userId ? { user_id: userId } : undefined
    const { data } = await api.get<AllProgressSummary>('/user-progress/summary', { params })
    return data
  },
}
