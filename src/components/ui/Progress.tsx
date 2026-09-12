import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Progress({
  value,
  max = 100,
  tone = 'indigo',
  className,
  size = 'md',
}: {
  value: number
  max?: number
  tone?: 'indigo' | 'emerald' | 'warning' | 'rose'
  className?: string
  size?: 'sm' | 'md'
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const tones = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    warning: 'bg-amber-500',
    rose: 'bg-rose-500',
  }
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full overflow-hidden rounded-full bg-slate-100', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function RadialScore({ value, size = 96, className }: { value: number; size?: number; className?: string }) {
  const radius = size / 2
  const stroke = 10
  const normalized = radius - stroke
  const circumference = 2 * Math.PI * normalized
  const offset = circumference - (value / 100) * circumference
  const tone = value >= 80 ? 'text-emerald-500' : value >= 60 ? 'text-amber-500' : 'text-rose-500'

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score ${value} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={radius} cy={radius} r={normalized} fill="none" strokeWidth={stroke} className="stroke-slate-100" />
        <circle
          cx={radius}
          cy={radius}
          r={normalized}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-all duration-700', tone)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Score</span>
      </div>
    </div>
  )
}

export function Rating({ value, count }: { value: number; count?: number | string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="font-semibold text-slate-900">{value.toFixed(1)}</span>
      <span className="text-amber-400" aria-hidden="true">{'★'.repeat(Math.round(value))}</span>
      {count !== undefined ? (
        <span className="text-slate-400">({count})</span>
      ) : null}
    </span>
  )
}

export function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">{icon}</span>
      <div>
        <p className="text-lg font-semibold leading-tight text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  )
}