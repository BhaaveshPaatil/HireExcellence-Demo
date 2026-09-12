import type { InterviewAnswer, InterviewQuestion, InterviewReport } from './types'

function hashText(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 1_000_000
  return hash
}

export function scoreAnswer(question: InterviewQuestion, answer: string | undefined, optedOption?: number): number {
  const text = (answer ?? '').trim().toLowerCase()
  const words = text.split(/\s+/).filter(Boolean)

  if (question.type === 'mcq') {
    if (question.correctIndex === undefined) return 0
    if (optedOption === question.correctIndex) return 100
    return 20
  }

  if (question.type === 'coding') {
    const markers = ['map', 'hash', 'o(n)', 'o(1)', 'loop', 'iterate', 'index', 'target', 'complement']
    const hits = markers.filter((m) => text.includes(m)).length
    const base = Math.round((hits / markers.length) * 55)
    const lengthBonus = Math.max(0, Math.min(20, words.length / 5))
    const clarity = Math.max(0, Math.min(15, (words.length > 15 ? 15 : words.length) / 15 * 15))
    return Math.min(100, Math.round(base + lengthBonus + clarity))
  }

  if (question.type === 'system') {
    const markers = ['cache', 'database', 'db', 'scale', 'load balancer', 'queue', 'latency', 'store', 'redirect', 'hash', 'replica', 'cdn']
    const hits = markers.filter((m) => text.includes(m)).length
    const base = Math.round((hits / markers.length) * 60)
    const structure = words.length > 30 ? 20 : Math.round((words.length / 30) * 20)
    const clarity = Math.max(0, Math.min(15, (words.length > 15 ? 15 : words.length) / 15 * 15))
    return Math.min(100, Math.round(base + structure + clarity))
  }

  // Behavioral
  const star = ['situation', 'task', 'action', 'result', 'outcome', 'because', 'i did', 'learned']
  const starHits = star.filter((m) => text.includes(m)).length
  const substance = Math.min(30, words.length / 4)
  const structure = Math.min(30, text.split(/[.!?]/).filter((s) => s.trim().length > 5).length * 6)
  const specificity = hashText(text) % 20
  return Math.min(100, Math.round(starHits * 8 + substance + structure + Math.min(15, specificity * 0.5)))
}

export function buildReport(
  questions: InterviewQuestion[],
  answers: InterviewAnswer[],
  optedMap: Record<string, number>,
  role: string,
  level: string,
  totalSeconds: number,
): InterviewReport {
  const rows = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id)
    const raw = scoreAnswer(q, answer?.answer, optedMap[q.id])
    const skipped = answer?.skipped ?? false
    const baseScore = skipped ? 25 : raw
    const completeness = answer ? Math.min(95, 40 + Math.min(50, (answer.answer ?? '').trim().length / 8)) : 20
    const score = Math.round(baseScore * (completeness / 100) * 0.55 + baseScore * 0.45)

    let feedback: string
    if (skipped) feedback = 'Skipped. Revisit this skill and try again with the AI interviewer.'
    else if (score >= 80) feedback = 'Strong answer. You showed structure, specifics, and clear reasoning.'
    else if (score >= 55) feedback = 'Good direction, but it needs more structure and concrete examples.'
    else feedback = 'Keep practicing this one — aim for a clear structure and real specifics.'

    const prompt = q.prompt.startsWith('Which of the following') ? q.prompt : q.prompt
    return {
      questionId: q.id,
      prompt,
      skill: q.skill,
      score,
      idealPoints: q.idealPoints,
      feedback,
      userAnswer: skipped ? 'Skipped' : (answer?.answer ?? optedMap[q.id] !== undefined ? `Selected option ${(optedMap[q.id] ?? 0) + 1}` : 'No answer recorded'),
    }
  })

  const accuracy = Math.round(rows.reduce((sum, r) => sum + r.score, 0) / rows.length)
  const completeness = Math.round(rows.reduce((sum, r) => sum + (r.userAnswer === 'Skipped' || r.userAnswer === 'No answer recorded' ? 70 : 92), 0) / rows.length)
  const communication = Math.round(rows.reduce((sum, r) => sum + Math.max(60, Math.min(96, r.score + 8)), 0) / rows.length)
  const overallScore = Math.round(accuracy * 0.5 + completeness * 0.25 + communication * 0.25)

  const strengths: string[] = []
  const improvements: string[] = []
  if (accuracy >= 70) strengths.push('Consistently accurate answers across question types')
  if (communication >= 70) strengths.push('Clear, structured verbal responses')
  if (rows.filter((r) => r.score >= 80).length >= 2) strengths.push('Strong performance in ' + rows.filter((r) => r.score >= 80).slice(0, 2).map((r) => r.skill).join(' and '))
  if (strengths.length === 0) strengths.push('You showed up and engaged with every question — that is a great first step')

  const weak = rows.filter((r) => r.score < 55).map((r) => r.skill)
  if (weak.length > 0) improvements.push(`Focused review needed in ${[...new Set(weak)].slice(0, 2).join(' and ')}`)
  if (accuracy < 60) improvements.push('Revisit core problem-solving patterns before the next mock')
  if (completeness < 75) improvements.push('Elaborate more — answers lacked depth in several places')
  if (improvements.length === 0) improvements.push('Push for concision: tighten answers without losing substance')

  const verdict =
    accuracy >= 80
      ? 'Excellent — interview-ready for this role.'
      : accuracy >= 60
        ? 'Solid baseline — 2–4 more focused sessions will get you there.'
        : 'Early stage — follow the improvement plan below and retry next week.'

  return {
    id: `report-${Date.now()}`,
    role,
    level,
    date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
    overallScore,
    accuracy,
    completeness,
    communication,
    timeUsedSec: totalSeconds,
    questions: rows,
    strengths,
    improvements,
    verdict,
  }
}