import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Headphones,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Zap,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { interviewLevels, interviewQuestions, interviewRoles } from '../data/mockData'
import { buildReport } from '../lib/scoring'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Field'
import { Progress } from '../components/ui/Progress'
import { formatDuration } from '../lib/utils'
import type { InterviewQuestion } from '../lib/types'

type Stage = 'setup' | 'active' | 'finished'

export default function AIInterview() {
  const { notify, setReport } = useApp()
  const navigate = useNavigate()

  const [stage, setStage] = useState<Stage>('setup')
  const [role, setRole] = useState(interviewRoles[0])
  const [level, setLevel] = useState(interviewLevels[1])
  const [camOn, setCamOn] = useState(true)
  const [micOn, setMicOn] = useState(true)

  const questions = useMemo(() => interviewQuestions, [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; durationSec: number; skipped: boolean }[]>([])
  const [opted, setOpted] = useState<Record<string, number>>({})
  const [draft, setDraft] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [aiStatus, setAiStatus] = useState<'thinking' | 'ready'>('ready')
  const [ellipsis, setEllipsis] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const questionStart = useRef(0)

  const question: InterviewQuestion = questions[index]
  const progress = (index / questions.length) * 100

  useEffect(() => {
    if (stage === 'active') {
      setSeconds(0)
      questionStart.current = Date.now()
    }
  }, [stage])

  useEffect(() => {
    document.body.style.overflow = stage === 'active' ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [stage])

  useEffect(() => {
    if (stage === 'active') {
      questionStart.current = Date.now()
    }
  }, [index, stage])

  useEffect(() => {
    if (stage !== 'active') return
    const tick = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(tick)
  }, [stage])

  useEffect(() => {
    if (stage !== 'active') return
    const interval = window.setInterval(() => {
      setEllipsis((e) => (e + 1) % 4)
    }, 500)
    return () => window.clearInterval(interval)
  }, [stage, index])

  useEffect(() => {
    if (stage !== 'active') return
    setAiStatus('thinking')
    setDraft('')
    setSelectedOption(null)
    const timeout = window.setTimeout(() => setAiStatus('ready'), 900)
    return () => window.clearTimeout(timeout)
  }, [index, stage])

  const recordAndNext = (skipped: boolean, optedOption?: number) => {
    const elapsed = Math.max(1, Math.round((Date.now() - questionStart.current) / 1000))
    questionStart.current = Date.now()
    const nextOpted = !skipped && optedOption !== undefined ? { ...opted, [question.id]: optedOption } : opted
    setOpted(nextOpted)
    const entry: (typeof answers)[number] = {
      questionId: question.id,
      answer: skipped ? '' : draft.trim(),
      durationSec: elapsed,
      skipped,
    }
    const nextAnswers = [...answers, entry]
    setAnswers(nextAnswers)
    if (index + 1 >= questions.length) {
      finish(nextAnswers, nextOpted)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const finish = (finalAnswers: typeof answers, finalOpted: Record<string, number> = opted) => {
    const report = buildReport(questions, finalAnswers, finalOpted, role, level, seconds)
    setStage('finished')
    setReport(report)
    notify('Interview complete! Your report is ready 🎉', 'success')
  }

  const startInterview = () => {
    setStage('active')
    setIndex(0)
    setAnswers([])
    setOpted({})
  }

  const finishFromButton = () => {
    const remaining = questions.slice(index)
    const skippedAnswers: typeof answers = remaining.map((q) => ({
      questionId: q.id,
      answer: '',
      durationSec: 0,
      skipped: true,
    }))
    finish(answers.concat(skippedAnswers), opted)
  }

  if (stage === 'setup') {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Mock Interview</h1>
          <p className="text-sm text-slate-500">Practice with a realistic, adaptive interviewer — then get a detailed report.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-slate-900">How it works</h2>
              <ul className="mt-4 space-y-4">
                {[
                  { icon: <Clock className="h-5 w-5" aria-hidden="true" />, title: '6 questions, ~10 minutes', text: 'Behavioral, coding, system design, and quick-check questions in one session.' },
                  { icon: <Mic className="h-5 w-5" aria-hidden="true" />, title: 'Answer as you would on the phone', text: 'Type your spoken-style answer. Camera and mic controls are simulated for realism.' },
                  { icon: <Zap className="h-5 w-5" aria-hidden="true" />, title: 'Instant AI evaluation', text: 'Receive skill-by-skill scores, strengths, and a focused improvement plan.' },
                ].map((step, i) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600" aria-hidden="true">
                      {step.icon}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <span className="text-xs font-bold text-indigo-500">0{i + 1}</span>
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="brand-surface p-6 text-white">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15" aria-hidden="true">
                  <Headphones className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold">Pro tip</p>
                  <p className="text-sm text-white/80">Answer out loud to yourself, keep answers under 90 seconds, and always close with a concrete result.</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="h-fit p-6 lg:col-span-2">
            <h2 className="text-base font-semibold text-slate-900">Set up your session</h2>
            <div className="mt-5 space-y-5">
              <Select label="Target role" value={role} onChange={(e) => setRole(e.target.value)}>
                {interviewRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
              <Select label="Experience level" value={level} onChange={(e) => setLevel(e.target.value)}>
                {interviewLevels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Simulated device check</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCamOn((c) => !c)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${camOn ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
                    aria-pressed={camOn}
                  >
                    {camOn ? <Video className="h-4 w-4" aria-hidden="true" /> : <VideoOff className="h-4 w-4" aria-hidden="true" />}
                    Camera {camOn ? 'on' : 'off'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMicOn((m) => !m)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${micOn ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
                    aria-pressed={micOn}
                  >
                    {micOn ? <Mic className="h-4 w-4" aria-hidden="true" /> : <MicOff className="h-4 w-4" aria-hidden="true" />}
                    Mic {micOn ? 'on' : 'off'}
                  </button>
                </div>
              </div>

              <Button onClick={startInterview} size="lg" className="w-full">
                Start interview
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <p className="text-center text-xs text-slate-400">Free forever · No signup needed · New questions weekly</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (stage === 'finished') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600" aria-hidden="true">
          <AlertCircle className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Interview complete!</h1>
        <p className="mt-2 text-sm text-slate-500">Your AI report has been generated.</p>
        <Button className="mt-6" size="lg" onClick={() => navigate('/interview/report')}>
          View my report
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">AI</span>
            <div>
              <p className="text-sm font-semibold text-white">AI Interviewer · {role} ({level})</p>
              <p className="text-xs text-slate-400">{aiStatus === 'thinking' ? `Reading…${'.'.repeat(ellipsis)}` : 'Listening…'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
              {formatDuration(seconds)}
            </span>
            <span className="hidden text-xs text-slate-400 sm:block">Q{index + 1} / {questions.length}</span>
            <Button variant="ghost" size="sm" className="!text-rose-400 hover:!bg-rose-500/10" onClick={finishFromButton}>
              End session
            </Button>
          </div>
        </div>

        {/* Preview strip */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/60 px-4 py-2.5">
          {camOn ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 ring-2 ring-white/20">
              <span className="text-xs font-bold text-white">{'You'.slice(0, 2).toUpperCase()}</span>
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">PRO</span>
          )}
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-slate-300">
              <span className={`h-2 w-2 rounded-full ${micOn ? 'bg-emerald-400' : 'bg-slate-500'}`} aria-hidden="true" />
              {micOn ? 'Microphone live — answer naturally' : 'Microphone muted'}
            </p>
            <p className="text-xs text-slate-500">{camOn ? 'You' : 'Camera off'} · {role}</p>
          </div>
          <button
            type="button"
            onClick={() => setMicOn((m) => !m)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {micOn ? <Mic className="h-4 w-4" aria-hidden="true" /> : <MicOff className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-8" aria-live="polite">
          <div className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            Question {index + 1} of {questions.length} · {question.skill}
          </div>

          {aiStatus === 'thinking' ? (
            <div className="mt-6 flex justify-center">
              <span className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />AI is reading your next question{'.'.repeat(ellipsis)}
              </span>
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-2xl bg-slate-800/80 p-6 shadow-xl ring-1 ring-slate-700/50">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">AI</span>
                  <Badge tone="violet" className="!bg-violet-500/20 !text-violet-300 !ring-violet-500/30">{question.type === 'mcq' ? 'Quick check' : question.skill}</Badge>
                </div>
                <h2 className="text-lg font-semibold leading-relaxed text-white">{question.prompt}</h2>
                {question.type === 'mcq' && question.options ? (
                  <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {question.options.map((option, i) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedOption(i)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                          selectedOption === i
                            ? 'border-indigo-400 bg-indigo-500/20 text-white'
                            : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                        }`}
                        aria-pressed={selectedOption === i}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={5}
                    placeholder="Type your answer as you would say it out loud…"
                    aria-label="Your answer"
                    className="mt-5 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm leading-relaxed text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => recordAndNext(true)}
                  className="text-sm font-medium text-slate-500 hover:text-slate-300"
                >
                  Skip question
                </button>
                <Button
                  size="lg"
                  disabled={question.type === 'mcq' ? selectedOption === null : !draft.trim()}
                  onClick={() => recordAndNext(false, selectedOption ?? undefined)}
                  className="!bg-white !text-slate-900 hover:!bg-slate-200"
                >
                  {index + 1 === questions.length ? 'Finish interview' : 'Next question'}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              {question.hint ? (
                <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
                  <span className="font-semibold text-slate-300">Hint: </span>{question.hint}
                </p>
              ) : null}
            </>
          )}
        </div>

        <div className="border-t border-slate-800 px-4 py-3">
          <Progress value={progress} tone="indigo" className="!bg-slate-800" />
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>{index} answered</span>
            <span>{questions.length - index} remaining</span>
          </div>
        </div>
      </div>
    </>
  )
}