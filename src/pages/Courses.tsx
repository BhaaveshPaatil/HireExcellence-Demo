import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Clock, GraduationCap, PlayCircle, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Rating } from '../components/ui/Progress'
import { cn, formatNumber } from '../lib/utils'
import type { Course as CourseType } from '../lib/types'

const categories = ['All', ...new Set(['Interview Prep', 'Career', 'Engineering'])]

export default function Courses() {
  const { courses, toggleSaveCourse, enrolledCourseIds } = useApp()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'browse' | 'my'>('browse')

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = category === 'All' || course.category === category
      const matchesQuery =
        !query.trim() || `${course.title} ${course.description} ${course.topics.join(' ')}`.toLowerCase().includes(query.toLowerCase())
      const matchesTab = tab === 'browse' || (tab === 'my' && course.enrolled)
      return matchesCategory && matchesQuery && matchesTab
    })
  }, [courses, category, query, tab])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Learn</h1>
          <p className="text-sm text-slate-500">Role-based courses from beginner to advanced, built around interviews.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-72 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, topics…"
              aria-label="Search courses"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-full bg-slate-200/70 p-1">
          {(['browse', 'my'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {t === 'browse' ? 'Browse' : `My courses (${enrolledCourseIds.length})`}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                category === c ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {tab === 'my' && enrolledCourseIds.length === 0 ? (
        <Card className="p-10 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
          <p className="mt-3 font-medium text-slate-700">You haven’t enrolled in any courses yet</p>
          <p className="text-sm text-slate-500">Pick a course below and start learning.</p>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} onToggleSave={() => toggleSaveCourse(course.id)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500">No courses match your filters.</Card>
      ) : null}
    </div>
  )
}

function CourseCard({ course, onToggleSave }: { course: CourseType; onToggleSave: () => void }) {
  return (
    <Card hover className="group flex flex-col overflow-hidden">
      <Link to={`/learn/${course.id}`} aria-label={`Open ${course.title}`} className="relative block">
        <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${course.color}`}>
          <GraduationCap className="h-12 w-12 text-white/80" aria-hidden="true" />
          <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {course.level}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge tone="primary">{course.category}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onToggleSave}
            aria-pressed={course.saved}
            aria-label={course.saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Bookmark className={cn('h-4 w-4', course.saved && 'fill-indigo-600 text-indigo-600')} aria-hidden="true" />
          </Button>
        </div>
        <Link to={`/learn/${course.id}`} className="mt-3 block">
          <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
            {course.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.tagline}</p>
        </Link>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <Rating value={course.rating} />
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{course.duration}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-500">{formatNumber(course.students)} students</span>
          {course.enrolled ? (
            <Badge tone="success">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {course.enrolledProgress ?? 0}% complete
            </Badge>
          ) : (
            <Link to={`/learn/${course.id}`}>
              <Button size="sm" variant="secondary">
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                Start
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}