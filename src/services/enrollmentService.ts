import { createCrudService } from './factory'
import type { CourseEnrollment, CourseEnrollmentCreate } from '../types'

export const enrollmentService = createCrudService<CourseEnrollment, CourseEnrollmentCreate>({ basePath: '/course-enrollments' })
