import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const fieldBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

interface FieldProps {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  id?: string
  className?: string
}

function FieldShell({
  label,
  error,
  hint,
  icon,
  id,
  className,
  children,
}: FieldProps & { children: ReactNode }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </span>
        ) : null}
        {children}
      </div>
      {hint && !error ? <p className="text-xs text-slate-400">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-600" role="alert">{error}</p> : null}
    </div>
  )
}

export function Input({
  label,
  error,
  hint,
  icon,
  id,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id ?? props.name
  return (
    <FieldShell label={label} error={error} hint={hint} icon={icon} id={inputId} className={className}>
      <input id={inputId} className={cn(fieldBase, icon && 'pl-10', error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20')} {...props} />
    </FieldShell>
  )
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id ?? props.name
  return (
    <FieldShell label={label} error={error} hint={hint} id={inputId} className={className}>
      <textarea id={inputId} className={cn(fieldBase, 'resize-y', error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20')} {...props} />
    </FieldShell>
  )
}

export function Select({
  label,
  error,
  hint,
  icon,
  id,
  className,
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const inputId = id ?? props.name
  return (
    <FieldShell label={label} error={error} hint={hint} icon={icon} id={inputId} className={className}>
      <select id={inputId} className={cn(fieldBase, 'appearance-none bg-no-repeat pr-9', icon && 'pl-10')} style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
        backgroundPosition: 'right 0.5rem center',
        backgroundSize: '1.5em 1.5em',
      }} {...props}>
        {children}
      </select>
    </FieldShell>
  )
}