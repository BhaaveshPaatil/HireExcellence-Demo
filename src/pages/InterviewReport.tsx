import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  Download,
  Lightbulb,
  Mic,
  Shield,
  Sparkles,
  Target,
  Timer,
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { RadialScore, Progress } from '../components/ui/Progress'
import { cn, formatDuration } from '../lib/utils'

export default function InterviewReport() {
  const { report, notify } = useApp()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | null>(report?.questions[0]?.questionId ?? null)

  if (!report) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600" aria-hidden="true">
          <Mic className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">No report yet</h1>
        <p className="mt-2 text-sm text-slate-500">Complete an AI mock interview to generate your detailed performance report.</p>
        <Link to="/interview">
          <Button className="mt-6" size="lg">
            Take an interview
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    )
  }

  const best = [...report.questions].sort((a, b) => b.score - a.score)[0]
  const weakest = [...report.questions].sort((a, b) => a.score - b.score)[0]
  const barTone = (score: number): 'emerald' | 'warning' | 'rose' =>
    score >= 80 ? 'emerald' : score >= 55 ? 'warning' : 'rose'

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/interview" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to interviews
      </Link>

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-indigo-500" aria-hidden="true" />
        <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[auto_1fr]">
          <div className="flex items-center gap-6">
            <RadialScore value={report.overallScore} size={140} />
            <div className="lg:hidden">
              <h1 className="text-xl font-bold text-slate-900">Interview report</h1>
              <p className="text-sm text-slate-500">{report.role} · {report.level}</p>
            </div>
          </div>
          <div>
            <div className="hidden items-center justify-between lg:flex">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Interview report</h1>
                <p className="text-sm text-slate-500">{report.role} · {report.level} · {report.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => notify('Report downloaded (demo)', 'success')}>
                  <Download className="h-4 w-4" aria-hidden="true" />Download PDF
                </Button>
                <Button size="sm" onClick={() => navigate('/interview')}>
                  <Mic className="h-4 w-4" aria-hidden="true" />Retake
                </Button>
              </div>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden="true" />
              {report.verdict}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: <Target className="h-4 w-4" aria-hidden="true" />, label: 'Accuracy', value: report.accuracy },
                { icon: <Shield className="h-4 w-4" aria-hidden="true" />, label: 'Completeness', value: report.completeness },
                { icon: <Mic className="h-4 w-4" aria-hidden="true" />, label: 'Communication', value: report.communication },
                { icon: <Timer className="h-4 w-4" aria-hidden="true" />, label: 'Time used', value: formatDuration(report.timeUsedSec), plain: true },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-indigo-500">{item.icon}</span>
                    {item.label}
                  </div>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {'value' in item && typeof item.value === 'number' && !item.plain ? `${item.value}` : item.value}
                  </p>
                  {'value' in item && typeof item.value === 'number' && !item.plain ? (
                    <Progress value={item.value} size="sm" tone={item.value >= 70 ? 'emerald' : item.value >= 50 ? 'warning' : 'rose'} className="mt-1.5" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-3 lg:hidden">
          <Button variant="outline" size="sm" onClick={() => notify('Report downloaded (demo)', 'success')}>
            <Download className="h-4 w-4" aria-hidden="true" />Download PDF
          </Button>
          <Button size="sm" onClick={() => navigate('/interview')}>
            <Mic className="h-4 w-4" aria-hidden="true" />Retake
          </Button>
        </div>
      </Card>

      {/* Strengths & improvements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
            <Award className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            Strengths
          </h2>
          <ul className="space-y-3 p-5 pt-3">
            {report.strengths.map((strength) => (
              <li key={strength} className="flex items-start gap-3 text-sm text-slate-600">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                {strength}
              </li>
            ))}
          </ul>
          {best ? (
            <div className="mx-5 mb-5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Best answer</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{best.skill}</p>
              <p className="mt-0.5 text-xs text-slate-500">{best.feedback}</p>
            </div>
          ) : null}
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
            <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Improvement plan
          </h2>
          <ul className="space-y-3 p-5 pt-3">
            {report.improvements.map((item, i) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
          {weakest ? (
            <div className="mx-5 mb-5 rounded-xl border border-rose-100 bg-rose-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Focus area</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{weakest.skill}</p>
              <p className="mt-0.5 text-xs text-slate-500">{weakest.feedback}</p>
            </div>
          ) : null}
        </Card>
      </div>

      {/* Question breakdown */}
      <Card>
        <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Question-by-question breakdown</h2>
        <div className="space-y-2 p-5">
          {report.questions.map((q) => {
            const isOpen = expanded === q.questionId
            return (
              <div key={q.questionId} className="overflow-hidden rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : q.questionId)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <Badge tone={barTone(q.score) === 'emerald' ? 'success' : barTone(q.score) === 'warning' ? 'warning' : 'danger'} className="w-12 justify-center !px-0">{q.score}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{q.skill}</p>
                    <p className="truncate text-xs text-slate-500">{q.prompt}</p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  )}
                </button>
                {isOpen ? (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Progress value={q.score} tone={barTone(q.score)} className="flex-1" />
                      <span className="text-xs font-semibold text-slate-500">{q.score}/{q.idealPoints}</span>
                    </div>
                    <div className={cn('mt-3 rounded-lg px-3 py-2 text-sm', q.score >= 55 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                      {q.feedback}
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your answer</p>
                      <p className="mt-1 whitespace-pre-line rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                        {q.userAnswer === 'Skipped' || q.userAnswer === 'No answer recorded' ? (
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <CircleX className="h-4 w-4" aria-hidden="true" />
                            {q.userAnswer}
                          </span>
                        ) : (
                          q.userAnswer
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={() => navigate('/interview')}>
          <Mic className="h-4 w-4" aria-hidden="true" />
          Retake interview with feedback
        </Button>
      </div>
    </div>
  )
}