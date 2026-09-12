import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Circle,
  Dumbbell,
  Flame,
  PlayCircle,
  Trophy,
  Zap,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui/Badge'
import { difficultyTone } from '../lib/badges'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Stat } from '../components/ui/Progress'
import { cn, formatNumber } from '../lib/utils'
import type { Difficulty } from '../lib/types'

const difficulties: Array<Difficulty | 'All'> = ['All', 'Easy', 'Medium', 'Hard']
const categories = ['All', 'Arrays & Hashing', 'Stack', 'Dynamic Programming', 'Sliding Window', 'Intervals']

export default function PracticeDashboard() {
  const { problems, solvedProblemIds, attemptedProblemIds } = useApp()
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [streak] = useState(6)

  const filtered = problems.filter((p) => {
    const matchesDifficulty = difficulty === 'All' || p.difficulty === difficulty
    const matchesCategory = category === 'All' || p.category === category
    const matchesStatus =
      status === 'All' ||
      (status === 'Solved' && p.status === 'solved') ||
      (status === 'Attempted' && p.status === 'attempted')
    const matchesQuery = !query.trim() || `${p.title} ${p.category} ${p.companies.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    return matchesDifficulty && matchesCategory && matchesStatus && matchesQuery
  })

  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length
  const solvedEasy = problems.filter((p) => p.difficulty === 'Easy' && p.status === 'solved').length
  const solvedMedium = problems.filter((p) => p.difficulty === 'Medium' && p.status === 'solved').length
  const solvedHard = problems.filter((p) => p.difficulty === 'Hard' && p.status === 'solved').length
  const nextUp = problems.find((p) => p.status !== 'solved')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Practice</h1>
          <p className="text-sm text-slate-500">Sharpen your problem-solving, one pattern at a time.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5">
          <Flame className="h-5 w-5 text-amber-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold leading-tight text-amber-700">{streak}-day streak</p>
            <p className="text-[11px] text-amber-600/80">Solve 1 problem a day to maintain it</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <Stat icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />} label="Problems solved" value={solvedProblemIds.length} />
        </Card>
        <Card className="p-4">
          <Stat icon={<Zap className="h-5 w-5" aria-hidden="true" />} label="Attempted" value={attemptedProblemIds.length} />
        </Card>
        <Card className="p-4">
          <Stat icon={<Award className="h-5 w-5" aria-hidden="true" />} label="Acceptance rate" value={`${Math.round(47.8)}%`} />
        </Card>
        <Card className="p-4">
          <Stat icon={<Trophy className="h-5 w-5" aria-hidden="true" />} label="Rank" value={`#${(1204 - solvedProblemIds.length * 7).toLocaleString()}`} />
        </Card>
      </div>

      {/* Per-difficulty mastery */}
      <Card>
        <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Progress by difficulty</h2>
        <div className="space-y-4 p-5">
          {[
            { label: 'Easy', solved: solvedEasy, total: easyCount, tone: 'bg-emerald-500' as const },
            { label: 'Medium', solved: solvedMedium, total: mediumCount, tone: 'bg-amber-500' as const },
            { label: 'Hard', solved: solvedHard, total: hardCount, tone: 'bg-rose-500' as const },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{row.label}</span>
                <span className="text-slate-500">{row.solved}/{row.total} solved</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={cn('h-full rounded-full transition-all duration-500', row.tone)} style={{ width: `${(row.solved / row.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {nextUp ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl brand-surface p-6 text-white sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15" aria-hidden="true">
              <Dumbbell className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">Recommended next</p>
              <p className="text-lg font-bold">{nextUp.title}</p>
              <p className="text-sm text-white/80">{nextUp.category} · asked by {nextUp.companies[0]}</p>
            </div>
          </div>
          <Link to={`/practice/${nextUp.id}`}>
            <Button className="!bg-white !text-indigo-700 hover:!bg-slate-100">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Solve now
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Difficulty</span>
          {difficulties.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                difficulty === d ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Topic</span>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                category === c ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Status</span>
          {['All', 'Solved', 'Attempted'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                status === s ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              {s}
            </button>
          ))}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems…"
            aria-label="Search problems"
            className="ml-auto w-full max-w-[14rem] rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Problem list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="hidden grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
          <span>Problem</span>
          <span className="w-40 text-right">Companies</span>
          <span className="w-16 text-center">Freq.</span>
          <span className="w-24 text-center">Accept.</span>
          <span className="w-20 text-center">Status</span>
        </div>
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No problems match your filters.</p>
        ) : (
          filtered.map((problem) => (
            <Link
              key={problem.id}
              to={`/practice/${problem.id}`}
              className="grid grid-cols-1 gap-2 border-b border-slate-50 px-5 py-4 transition-colors last:border-0 hover:bg-slate-50 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center md:gap-4"
            >
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {problem.status === 'solved' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  ) : problem.status === 'attempted' ? (
                    <Circle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
                  )}
                  {problem.title}
                </p>
                <div className="mt-1 flex items-center gap-2 md:hidden">
                  <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
                  <span className="text-xs text-slate-400">{problem.category}</span>
                </div>
              </div>
              <div className="hidden w-40 items-center justify-end gap-1.5 md:flex">
                {problem.companies.slice(0, 3).map((company) => (
                  <span key={company} title={company} className="text-xs font-medium text-slate-500">{company.split(' ')[0]}</span>
                ))}
              </div>
              <span className="hidden w-16 text-center text-xs text-slate-500 md:block">{problem.frequency}%</span>
              <span className="hidden w-24 text-center text-xs text-slate-500 md:block">{problem.acceptance}%</span>
              <div className="hidden w-20 items-center justify-center md:flex">
                <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <span className="text-xs text-slate-400">Acceptance {problem.acceptance}%</span>
                <ChevronRight className="ml-auto h-4 w-4 text-slate-300" aria-hidden="true" />
              </div>
            </Link>
          ))
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        {formatNumber(23014)} students are practicing right now alongside you
      </p>
    </div>
  )
}