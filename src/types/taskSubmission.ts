export interface TaskSubmission {
  id: number
  task_id: number
  user_id: number
  file_url: string
  original_filename: string
  mime_type: string
  submitted_at: string
  score?: number | null
  feedback?: string | null
  passed?: boolean
  graded_by?: number | null
  graded_at?: string | null
}

export interface TaskSubmissionWithUser extends TaskSubmission {
  user_name: string
  user_email: string
  grader_name?: string | null
}

export interface GradeRequest {
  score: number
  feedback?: string | null
}
