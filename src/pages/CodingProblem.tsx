import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Copy,
  Flag,
  Lightbulb,
  Loader2,
  Play,
  Send,
  ThumbsUp,
  XCircle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui/Badge'
import { difficultyTone } from '../lib/badges'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'
import type { Difficulty } from '../lib/types'

interface JudgeResult {
  status: 'idle' | 'running' | 'passed' | 'failed' | 'error'
  passed: number
  total: number
  message: string
  error?: string
  failedInput?: string
  expected?: string
  actual?: string
}

const difficultyColor: Record<Difficulty, string> = {
  Easy: 'text-emerald-600',
  Medium: 'text-amber-600',
  Hard: 'text-rose-600',
}

export default function CodingProblem() {
  const { id } = useParams()
  const { problems, markProblem, notify } = useApp()
  const problem = problems.find((p) => p.id === id)

  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(problem?.starterCode ?? '')
  const [runResult, setRunResult] = useState<JudgeResult>({ status: 'idle', passed: 0, total: 0, message: '' })
  const [submitResult, setSubmitResult] = useState<JudgeResult>({ status: 'idle', passed: 0, total: 0, message: '' })
  const [tab, setTab] = useState<'description' | 'editorial'>('description')
  const [liked, setLiked] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const nextProblem = useMemo(() => {
    const idx = problems.findIndex((p) => p.id === problem?.id)
    if (idx === -1) return null
    return problems[(idx + 1) % problems.length]
  }, [problems, problem?.id])

  if (!problem) {
    return (
      <div className="p-10 text-center text-slate-500">
        Problem not found.{' '}
        <Link to="/practice" className="font-semibold text-indigo-600 hover:text-indigo-500">Back to practice</Link>
      </div>
    )
  }

  const latest = runResult.status === 'running' ? runResult : runResult.status !== 'idle' ? runResult : submitResult.status === 'running' ? submitResult : submitResult
  const resolvedId = problem.id

  const run = () => {
    setRunResult({ status: 'running', passed: 0, total: 0, message: 'Compiling and running sample tests…' })
    window.setTimeout(() => {
      const judge = executeJudge(code, problem.testCases.slice(0, Math.min(2, problem.testCases.length)))
      setRunResult(judge)
    }, 900)
  }

  const submit = () => {
    setSubmitResult({ status: 'running', passed: 0, total: 0, message: 'Running all test cases…' })
    window.setTimeout(() => {
      const judge = executeJudge(code, problem.testCases)
      setSubmitResult(judge)
      if (judge.status === 'passed') markProblem(resolvedId, 'solved')
      else if (judge.status === 'failed') markProblem(resolvedId, 'attempted')
    }, 1400)
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-6.5rem)] max-w-[90rem] flex-col gap-4 lg:h-[calc(100dvh-5.5rem)] lg:flex-row">
      {/* Description pane */}
      <section className="scrollbar-thin flex min-h-0 w-full flex-col overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:w-[42%]" aria-label="Problem description">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3">
          <Link to="/practice" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Problems
          </Link>
          <span className={cn('text-sm font-bold', difficultyColor[problem.difficulty])}>
            {problem.difficulty}
          </span>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{problem.title}</h1>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setLiked((l) => !l)
                  notify(liked ? 'Removed like' : 'Liked this problem', 'success')
                }}
                className={cn('flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-100', liked && 'text-indigo-600')}
                aria-label="Like problem"
              >
                <ThumbsUp className={cn('h-4 w-4', liked && 'fill-current')} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => notify('Something to report? We read every flag.', 'info')}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                aria-label="Report problem"
              >
                <Flag className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
            <span>Acceptance {problem.acceptance}%</span>
            <span>Frequency {problem.frequency}%</span>
            <span>{problem.likes.toLocaleString()} likes</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {problem.companies.map((company) => (
              <span key={company} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{company}</span>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex gap-1 border-b border-slate-100">
              {(['description', 'editorial'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium capitalize transition-colors',
                    tab === t ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  {t}
                  {tab === t ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-indigo-600" /> : null}
                </button>
              ))}
            </div>
          </div>

          {tab === 'description' ? (
            <>
              <div className="space-y-4 py-4 font-mono text-[13px] leading-relaxed text-slate-800">
                {problem.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="space-y-4">
                {problem.examples.map((example, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                      Example {i + 1}
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        onClick={() => notify('Example copied to clipboard', 'success')}
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />Copy
                      </button>
                    </div>
                    <div className="space-y-1.5 p-3">
                      <p className="font-mono text-xs text-slate-700"><span className="text-slate-400">Input: </span>{example.input}</p>
                      <p className="font-mono text-xs text-slate-700"><span className="text-slate-400">Output: </span>{example.output}</p>
                      {example.explanation ? (
                        <p className="text-xs text-slate-500"><span className="text-slate-400">Explanation: </span>{example.explanation}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-4">
                <h3 className="text-sm font-semibold text-slate-900">Constraints</h3>
                <ul className="mt-2 space-y-1">
                  {problem.constraints.map((constraint) => (
                    <li key={constraint} className="flex items-start gap-2 font-mono text-xs text-slate-600">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
                aria-expanded={showHint}
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              {showHint ? (
                <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm text-amber-800">
                  Think in terms of trading space for time. A hash map lets you answer each element’s complement check in O(1).
                </p>
              ) : null}
            </>
          ) : (
            <div className="py-4">
              <p className="text-sm leading-relaxed text-slate-600">
                <strong className="text-slate-900">Editorial (pattern: Frequency Map)</strong><br />
                Iterate once over the array, storing each value’s index in a hash map. For every element, check whether
                <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">target − nums[i]</code>
                already exists in the map — if it does, you found your pair.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                <strong className="text-slate-900">Complexity: </strong>
                O(n) time, O(n) space. This is the linear scan + hash map pattern, one of the 15 “must-know” interview patterns covered in our{' '}
                <Link to="/learn/c1" className="font-medium text-indigo-600 hover:text-indigo-500">DSA Patterns Bootcamp</Link>.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Editor pane */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm" aria-label="Code editor">
        <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/60 px-4 py-2.5">
          <label className="relative inline-flex items-center gap-1.5 text-sm text-slate-300">
            <span className="font-medium">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-900 py-1 pl-3 pr-8 text-sm font-medium text-slate-200 outline-none focus:border-indigo-400"
            >
              <option value="javascript">JavaScript</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 h-4 w-4 text-slate-400" aria-hidden="true" />
          </label>
          <span className="hidden text-xs text-slate-400 md:block">
            {language === 'javascript' ? '// Implement solution() and press Run' : ''}
          </span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="Code editor"
          className="scrollbar-thin min-h-[220px] flex-1 resize-none bg-slate-900 p-4 font-mono text-[13px] leading-relaxed text-slate-100 outline-none selection:bg-indigo-500/40"
        />

        <div className="flex items-center justify-between border-t border-slate-700/60 bg-slate-800/60 px-4 py-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <button type="button" onClick={() => { navigator.clipboard?.writeText(code).catch(() => undefined) }} className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-700" aria-label="Copy code">
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />Copy
            </button>
            <button type="button" onClick={() => setCode('')} className="rounded-md px-2 py-1 hover:bg-slate-700" aria-label="Reset code">Reset</button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={run}
              disabled={runResult.status === 'running' || submitResult.status === 'running'}
              className="!border-slate-500 !bg-transparent !text-slate-200 hover:!bg-slate-700"
            >
              {runResult.status === 'running' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              Run
            </Button>
            <Button
              size="sm"
              onClick={submit}
              disabled={submitResult.status === 'running' || runResult.status === 'running'}
              className="!bg-emerald-600 hover:!bg-emerald-500"
            >
              {submitResult.status === 'running' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              Submit
            </Button>
          </div>
        </div>

        {/* Console */}
        <div className="border-t border-slate-700/60 bg-slate-950">
          <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Console</p>
          <div className="scrollbar-thin max-h-40 min-h-[72px] overflow-y-auto px-4 py-2 font-mono text-xs leading-relaxed">
            {latest.status === 'idle' ? (
              <p className="text-slate-500">Run your code against sample test cases, then Submit to check everything.</p>
            ) : latest.status === 'running' ? (
              <p className="flex items-center gap-2 text-slate-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" aria-hidden="true" />
                {latest.message}
              </p>
            ) : latest.status === 'passed' ? (
              <div className="space-y-1.5">
                <p className="flex items-center gap-2 font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {latest.passed}/{latest.total} test cases passed
                </p>
                <p className="text-slate-400">{latest.message}</p>
              </div>
            ) : latest.status === 'failed' ? (
              <div className="space-y-1.5">
                <p className="flex items-center gap-2 font-semibold text-rose-400">
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  {latest.passed}/{latest.total} test cases passed
                </p>
                {latest.error ? <p className="text-rose-300">{latest.error}</p> : null}
                <p className="text-slate-400">Failed case:</p>
                {latest.failedInput ? <p className="text-slate-300">Input: {latest.failedInput}</p> : null}
                {latest.expected !== undefined ? <p className="text-slate-300">Expected: {latest.expected}</p> : null}
                {latest.actual !== undefined ? <p className="text-rose-300">Received: {latest.actual}</p> : null}
                <p className="text-slate-500">{latest.message}</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="font-semibold text-rose-400">Compilation / runtime error</p>
                <p className="text-rose-300">{latest.error}</p>
                <p className="text-slate-500">Make sure you define <span className="font-mono text-slate-300">function solution(...)</span> and return a value.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {nextProblem ? (
        <Link
          to={`/practice/${nextProblem.id}`}
          className="fixed bottom-16 right-4 z-30 flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-200 hover:bg-slate-50 md:bottom-8"
        >
          Next: {nextProblem.title}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}

function executeJudge(code: string, testCases: { args: unknown[]; expected: unknown }[]): JudgeResult {
  let solution: ((...args: unknown[]) => unknown) | undefined
  try {
    const raw = new Function(`"use strict";\n${code}\nreturn solution;`)()
    solution = typeof raw === 'function' ? (raw as (...args: unknown[]) => unknown) : undefined
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { status: 'error', passed: 0, total: testCases.length, message: 'Compilation failed.', error }
  }
  if (typeof solution !== 'function') {
    return {
      status: 'error',
      passed: 0,
      total: testCases.length,
      message: 'Could not find a function named `solution`.',
      error: 'Define `function solution(...)` inside the editor.',
    }
  }

  let passed = 0
  for (const tc of testCases) {
    try {
      const actual = JSON.stringify(solution(...tc.args))
      const expected = JSON.stringify(tc.expected)
      if (actual === expected) {
        passed++
      } else {
        return {
          status: 'failed',
          passed,
          total: testCases.length,
          message: 'One or more test cases did not pass.',
          failedInput: JSON.stringify(tc.args),
          expected,
          actual,
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      return {
        status: 'error',
        passed,
        total: testCases.length,
        message: `Runtime error on test case ${passed + 1}.`,
        error,
        failedInput: JSON.stringify(tc.args),
      }
    }
  }
  return { status: 'passed', passed: testCases.length, total: testCases.length, message: 'All test cases passed. Great work!' }
}