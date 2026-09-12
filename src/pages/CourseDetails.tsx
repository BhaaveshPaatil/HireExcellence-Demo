import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  GraduationCap,
  ListVideo,
  Lock,
  PlayCircle,
  Star,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Progress, Rating } from '../components/ui/Progress'
import { cn, formatNumber } from '../lib/utils'

export default function CourseDetails() {
  const { id } = useParams()
  const { courses, toggleSaveCourse, enrollCourse, toggleLesson, notify } = useApp()
  const course = courses.find((c) => c.id === id) ?? courses[0]
  const [openLesson, setOpenLesson] = useState<string | null>(null)

  if (!course) {
    return (
      <div className="p-10 text-center text-slate-500">
        Course not found.{' '}
        <Link to="/learn" className="font-semibold text-indigo-600 hover:text-indigo-500">Back to courses</Link>
      </div>
    )
  }

  const completedCount = course.lessons.filter((l) => l.completed).length
  const progress = course.enrolledProgress ?? Math.round((completedCount / course.lessons.length) * 100)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to all courses
      </Link>

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className={`relative h-40 brand-surface sm:h-52`}>
          <GraduationCap className="absolute right-6 top-1/2 h-20 w-20 -translate-y-1/2 text-white/30 sm:h-28 sm:w-28" aria-hidden="true" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-6 pb-6 sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral" className="!bg-white/20 !text-white !ring-white/30">{course.category}</Badge>
                <Badge tone="neutral" className="!bg-white/20 !text-white !ring-white/30">{course.level}</Badge>
                <Badge tone="neutral" className="!bg-white/20 !text-white !ring-white/30">Updated {course.updatedAt}</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4 pt-5">
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{course.title}</h1>
              <p className="mt-2 text-sm text-slate-600">{course.tagline}</p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => toggleSaveCourse(course.id)}
              aria-pressed={course.saved}
            >
              <Bookmark className={cn('h-4 w-4', course.saved && 'fill-indigo-600 text-indigo-600')} aria-hidden="true" />
              <span className="hidden sm:inline">{course.saved ? 'Saved' : 'Save'}</span>
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
            <Rating value={course.rating} count={formatNumber(course.students)} />
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" />{course.duration} of content</span>
            <span className="inline-flex items-center gap-1.5"><ListVideo className="h-4 w-4" aria-hidden="true" />{course.lessonsCount} lessons</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-3">
              <Avatar initials={course.instructor.initials} color={course.instructor.avatarColor} size="sm" alt={course.instructor.name} />
              <div>
                <p className="text-sm font-semibold text-slate-900">{course.instructor.name}</p>
                <p className="text-xs text-slate-500">{course.instructor.headline}</p>
              </div>
            </div>
            {course.enrolled ? (
              <div className="w-full max-w-xs">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />{completedCount}/{course.lessons.length} lessons</span>
                  <span className="font-semibold text-slate-800">{progress}%</span>
                </div>
                <Progress value={progress} tone="emerald" />
              </div>
            ) : (
              <Button size="lg" onClick={() => enrollCourse(course.id)}>Enroll for free</Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">About this course</h2>
            <p className="px-5 pb-5 pt-2 text-sm leading-relaxed text-slate-600">{course.description}</p>
          </Card>

          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">What you’ll learn</h2>
            <div className="flex flex-wrap gap-2 p-5 pt-3">
              {course.topics.map((topic) => (
                <Badge key={topic} tone="primary">{topic}</Badge>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
              <PlayCircle className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              Course content
            </h2>
            <p className="px-5 pt-1 text-xs text-slate-500">{course.lessons.length} lessons · {course.duration} total</p>
            <div className="space-y-1 p-4">
              {course.lessons.map((lesson, i) => {
                const active = openLesson === lesson.id
                const Icon = lesson.type === 'video' ? PlayCircle : lesson.type === 'article' ? FileText : lesson.type === 'quiz' ? GraduationCap : BookOpen
                return (
                  <div key={lesson.id} className="overflow-hidden rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        if (!course.enrolled && !lesson.isFree) {
                          notify('Enroll first to unlock this lesson 🔒', 'info')
                          return
                        }
                        setOpenLesson(active ? null : lesson.id)
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                      aria-expanded={active}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-hidden="true" />
                      )}
                      <span className="hidden w-8 text-center text-xs font-semibold text-slate-400 sm:block">{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0 flex-1">
                        <p className={cn('truncate text-sm font-medium', lesson.completed ? 'text-slate-500 line-through' : 'text-slate-800')}>
                          {lesson.title}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{lesson.type}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{lesson.duration}</span>
                        </p>
                      </div>
                      <span className="shrink-0">
                        {course.enrolled ? (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLesson(course.id, lesson.id)
                            }}
                            aria-pressed={lesson.completed}
                          >
                            {lesson.completed ? 'Completed' : 'Mark done'}
                          </Button>
                        ) : lesson.isFree ? (
                          <Badge tone="success">Free</Badge>
                        ) : (
                          <Lock className="h-4 w-4 text-slate-300" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                    {active && course.enrolled ? (
                      <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                        {lesson.type === 'video' ? (
                          <div className="flex h-40 items-center justify-center rounded-xl bg-slate-900 text-slate-400 sm:h-56">
                            <PlayCircle className="h-12 w-12" aria-hidden="true" /> Video preview (demo)
                          </div>
                        ) : (
                          <p className="text-sm text-slate-600">
                            {lesson.type === 'quiz'
                              ? 'Quiz content goes here — graded instantly on submission.'
                              : lesson.type === 'article'
                                ? 'Reading content goes here with code samples and downloadable cheatsheets.'
                                : 'Hands-on exercise instructions and starter files live here.'}
                          </p>
                        )}
                        <Button variant="ghost" size="sm" className="mt-3" onClick={() => toggleLesson(course.id, lesson.id)}>
                          {course.lessons.find((l) => l.id === lesson.id)?.completed ? (
                            <>Mark as not complete</>
                          ) : (
                            <><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Mark as complete</>
                          )}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="brand-surface text-white">
            <div className="p-5">
              <h3 className="text-base font-bold">Why students love this course</h3>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-3xl font-bold">{course.rating}</span>
                <span className="text-amber-300 text-lg" aria-hidden="true">{'★★★★★'.slice(0, 5)}</span>
              </div>
              <p className="mt-1 text-sm text-white/80">from {formatNumber(course.students)} ratings</p>
              <div className="mt-4 space-y-2">
                {[
                  { label: '5★', pct: 88 },
                  { label: '4★', pct: 9 },
                  { label: '3★', pct: 2 },
                  { label: '2★', pct: 1 },
                  { label: '1★', pct: 0 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2 text-xs text-white/80">
                    <span className="w-6">{row.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full rounded-full bg-white" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-7 text-right">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
              <Star className="h-5 w-5 text-amber-400" aria-hidden="true" />
              Recent reviews
            </h2>
            <div className="space-y-4 p-5">
              {[
                { name: 'Ananya K.', rating: 5, text: 'The pattern-first approach finally made DSA click for me. Landed 3 interviews within a month.' },
                { name: 'Tom W.', rating: 4, text: 'Clear explanations and the drills genuinely help retention. Would love more quiz questions.' },
              ].map((review) => (
                <div key={review.name} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                    <span className="text-xs text-amber-400" aria-hidden="true">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{review.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Meet your instructor</h2>
            <div className="p-5 pt-3">
              <div className="flex items-center gap-3">
                <Avatar initials={course.instructor.initials} color={course.instructor.avatarColor} size="md" alt={course.instructor.name} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{course.instructor.name}</p>
                  <p className="text-xs text-slate-500">{course.instructor.headline}</p>
                </div>
              </div>
              <Button variant="secondary" className="mt-4 w-full">Follow instructor</Button>
            </div>
          </Card>

          <Link to="/learn" className="flex items-center justify-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Explore more courses <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}