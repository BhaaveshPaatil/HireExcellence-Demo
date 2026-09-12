import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Paperclip,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { cn } from '../lib/utils'

export default function JobDetails() {
  const { id } = useParams()
  const { jobs, savedJobIds, toggleSaveJob, applyToJob } = useApp()
  const job = jobs.find((j) => j.id === id) ?? jobs[0]
  const saved = job ? savedJobIds.includes(job.id) : false
  const [applyOpen, setApplyOpen] = useState(false)
  const [note, setNote] = useState('')

  if (!job) {
    return <div className="p-10 text-center text-slate-500">Job not found.</div>
  }

  const submitApplication = () => {
    applyToJob(job.id)
    setApplyOpen(false)
    setNote('')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to all jobs
      </Link>

      <Card className="overflow-hidden">
        <div className={`h-20 ${job.logoColor} opacity-90`} aria-hidden="true" />
        <div className="px-6 pb-6">
          <div className="-mt-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <span className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg ${job.logoColor}`}>
                {job.company.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase()}
              </span>
              <div className="pb-1">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{job.title}</h1>
                <p className="text-sm text-slate-600">{job.company}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden="true" />{job.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden="true" />{job.posted}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" aria-hidden="true" />{job.applicants.toLocaleString()} applicants</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              <Button variant="outline" onClick={() => toggleSaveJob(job.id)} aria-pressed={saved}>
                <Bookmark className={cn('h-4 w-4', saved && 'fill-indigo-600 text-indigo-600')} aria-hidden="true" />
                <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
              </Button>
              <Button onClick={() => setApplyOpen(true)} disabled={job.applied}>
                {job.applied ? 'Applied ✓' : 'Apply now'}
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <Badge key={tag} tone="primary">{tag}</Badge>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">About the company</h2>
            <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{job.about}</p>
            <h3 className="px-5 text-base font-semibold text-slate-900">The role</h3>
            <p className="px-5 py-4 text-sm leading-relaxed text-slate-600">{job.description}</p>
          </Card>

          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">What you’ll do</h2>
            <ul className="space-y-3 p-5 pt-3">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">What we’re looking for</h2>
            <ul className="space-y-3 p-5 pt-3">
              {job.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Perks & benefits</h2>
            <div className="space-y-3 p-5 pt-3">
              {job.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  {benefit}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Recruiter</h2>
            <div className="flex items-center gap-3 p-5 pt-4">
              <Avatar initials={job.recruiter.initials} color={job.recruiter.avatarColor} size="md" alt={job.recruiter.name} />
              <div>
                <p className="text-sm font-semibold text-slate-900">{job.recruiter.name}</p>
                <p className="text-xs text-slate-500">{job.recruiter.headline}</p>
              </div>
            </div>
            <div className="border-t border-slate-100 px-5 pb-5 pt-4">
              <Button variant="secondary" className="w-full">Message recruiter</Button>
            </div>
          </Card>

          <Card className="brand-surface text-white">
            <div className="flex flex-col items-center gap-3 p-5 text-center">
              <Briefcase className="h-8 w-8" aria-hidden="true" />
              <p className="text-sm font-medium">This role matches {job.tags.length} of your skills. Your profile is a 92% match.</p>
              {job.applied ? (
                <Badge tone="success" className="!bg-white/20 !text-white !ring-white/30">Application submitted</Badge>
              ) : (
                <Button className="!bg-white !text-indigo-700 hover:!bg-slate-100" onClick={() => setApplyOpen(true)}>
                  Apply now
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply to ${job.title}`}
        subtitle={`${job.company} · ${job.location}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
            <Button onClick={submitApplication} disabled={!note.trim()}><Send className="h-4 w-4" aria-hidden="true" />Submit application</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Upload resume</p>
              <p className="text-xs text-slate-500">PDF or Word, up to 5 MB</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => undefined}>
              <Paperclip className="h-4 w-4" aria-hidden="true" />
              Choose file
            </Button>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Add a short note <span className="font-normal text-slate-400">(optional, recommended)</span></span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Why are you excited about this role and what makes you a great fit?"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </label>
        </div>
      </Modal>
    </div>
  )
}