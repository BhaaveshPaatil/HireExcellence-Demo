import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, Briefcase, ChevronRight, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'
import type { JobType } from '../lib/types'

const typeFilters: Array<JobType | 'All'> = ['All', 'Internship', 'Full-time', 'Contract', 'Remote']

export default function Jobs() {
  const { jobs, savedJobIds, toggleSaveJob } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [type, setType] = useState<JobType | 'All'>('All')
  const [selected, setSelected] = useState<string>(jobs[0]?.id ?? '')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesQuery =
        !query.trim() ||
        `${job.title} ${job.company} ${job.location} ${job.tags.join(' ')}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      const matchesType =
        type === 'All' ||
        (type === 'Remote' ? job.location.toLowerCase().includes('remote') : job.type === type)
      return matchesQuery && matchesType
    })
  }, [jobs, query, type])

  const activeJob = filtered.find((job) => job.id === selected) ?? filtered[0]

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Jobs</h1>
          <p className="text-sm text-slate-500">{jobs.length} opportunities matched to your profile</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-72 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, company, skill…"
              aria-label="Search jobs"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <Button variant="outline" size="md" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-label="Toggle filters">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {showFilters ? (
        <div className="animate-fade-in-up flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-sm font-medium text-slate-500">Job type</span>
          {typeFilters.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                type === t ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,24rem)_1fr]">
        {/* List */}
        <div className="space-y-3" aria-label="Job listings">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-700">No jobs match your search</p>
              <p className="text-xs text-slate-500">Try different keywords or clear the filters.</p>
            </div>
          ) : (
            filtered.map((job) => {
              const saved = savedJobIds.includes(job.id)
              const isActive = job.id === activeJob?.id
              return (
                <div
                  key={job.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(job.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelected(job.id)
                      navigate(`/jobs/${job.id}`)
                    }
                  }}
                  aria-pressed={isActive}
                  className={cn(
                    'group cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-all',
                    isActive ? 'border-indigo-300 ring-2 ring-indigo-500/20' : 'border-slate-200/80 hover:border-slate-300',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white', job.logoColor)}>
                      {job.company.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-bold text-slate-900 group-hover:text-indigo-600">{job.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSaveJob(job.id)
                          }}
                          aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
                          aria-pressed={saved}
                        >
                          <Bookmark className={cn('h-4 w-4', saved && 'fill-indigo-600 text-indigo-600')} aria-hidden="true" />
                        </Button>
                      </div>
                      <p className="truncate text-sm text-slate-600">{job.company} · {job.salary}</p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {job.location}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <Badge tone={job.type === 'Internship' ? 'info' : job.type === 'Remote' ? 'violet' : 'neutral'}>{job.type}</Badge>
                    {job.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} tone="neutral">{tag}</Badge>
                    ))}
                    <span className="ml-auto text-xs text-slate-400">{job.posted}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Detail */}
        <div className="hidden lg:block">
          {activeJob ? (
            <div className="sticky top-20">
              <JobSummary
                key={activeJob.id}
                jobId={activeJob.id}
                onOpenJob={() => navigate(`/jobs/${activeJob.id}`)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function JobSummary({
  jobId,
  onOpenJob,
}: {
  jobId: string
  onOpenJob: () => void
}) {
  const { jobs, toggleSaveJob, savedJobIds } = useApp()
  const job = jobs.find((j) => j.id === jobId)
  if (!job) return null
  const saved = savedJobIds.includes(job.id)
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white ${job.logoColor}`}>
            {job.company.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
            <p className="text-sm text-slate-600">{job.company}</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-400"><MapPin className="h-4 w-4" aria-hidden="true" />{job.location}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
          <div><p className="text-sm font-bold text-slate-900">{job.salary}</p><p className="text-[11px] text-slate-500">Compensation</p></div>
          <div><p className="text-sm font-bold text-slate-900">{job.type}</p><p className="text-[11px] text-slate-500">Type</p></div>
          <div><p className="text-sm font-bold text-slate-900">{job.applicants.toLocaleString()}</p><p className="text-[11px] text-slate-500">Applicants</p></div>
        </div>
        <div className="mt-5 flex gap-2">
          <Button className="flex-1" onClick={onOpenJob}>View & apply</Button>
          <Button variant="outline" onClick={() => toggleSaveJob(job.id)} aria-pressed={saved}>
            <Bookmark className={cn('h-4 w-4', saved && 'fill-indigo-600 text-indigo-600')} aria-hidden="true" />
            <span className="sr-only">Save job</span>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Posted by</h3>
        <div className="mt-3 flex items-center gap-3">
          <Avatar initials={job.recruiter.initials} color={job.recruiter.avatarColor} size="sm" alt={job.recruiter.name} />
          <div>
            <p className="text-sm font-semibold text-slate-900">{job.recruiter.name}</p>
            <p className="text-xs text-slate-500">{job.recruiter.headline}</p>
          </div>
          <Link to="/jobs" className="ml-auto text-sm font-semibold text-indigo-600 hover:text-indigo-500" aria-label="View all jobs">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}