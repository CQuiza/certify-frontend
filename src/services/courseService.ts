import api from './api'
import { config } from '../config'
import { createCrudService } from './factory'
import type { Course, CourseCreate, CourseUpdate } from '../types'

const base = createCrudService<Course, CourseCreate, CourseUpdate>({ basePath: '/courses' })

export const courseService = {
  ...base,

  uploadImage: async (courseId: number, file: File): Promise<Course> => {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await api.post<Course>(`/courses/${courseId}/image`, fd)
    return data
  },

  removeImage: async (courseId: number): Promise<void> => {
    await api.delete(`/courses/${courseId}/image`)
  },

  imageUrl: (courseId: number): string => `${config.apiUrl}/courses/${courseId}/image`,
}
