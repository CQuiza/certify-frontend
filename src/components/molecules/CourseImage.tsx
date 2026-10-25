import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { courseService } from '../../services/courseService'

type Variant = 'cover' | 'thumb' | 'banner'

interface CourseImageProps {
  courseId: number
  title: string
  hasImage?: boolean
  variant?: Variant
}

const SIZES: Record<Variant, { box: string; icon: string }> = {
  cover: { box: 'h-44 w-full', icon: 'h-10 w-10' },
  thumb: {
    box: 'h-14 w-20 shrink-0 rounded-lg border border-slate-200 sm:h-12 sm:w-16',
    icon: 'h-5 w-5',
  },
  banner: {
    box: 'mb-6 h-56 w-full rounded-xl border border-slate-200 sm:h-72',
    icon: 'h-10 w-10',
  },
}

export default function CourseImage({
  courseId,
  title,
  hasImage,
  variant = 'cover',
}: CourseImageProps) {
  const [failed, setFailed] = useState(false)
  const { box, icon } = SIZES[variant]

  if (!hasImage || failed) {
    return (
      <div className={`flex items-center justify-center bg-emerald-50 text-emerald-500 ${box}`}>
        <BookOpen className={icon} />
      </div>
    )
  }

  return (
    <img
      src={courseService.imageUrl(courseId)}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${box}`}
    />
  )
}
