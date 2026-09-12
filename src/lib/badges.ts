export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'violet'

export function difficultyTone(difficulty: 'Easy' | 'Medium' | 'Hard'): BadgeTone {
  if (difficulty === 'Easy') return 'success'
  if (difficulty === 'Medium') return 'warning'
  return 'danger'
}