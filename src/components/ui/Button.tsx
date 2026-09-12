import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  active?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-indigo-500/40 disabled:hover:bg-indigo-600',
  secondary:
    'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus-visible:ring-indigo-500/30 disabled:hover:bg-indigo-50',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400/30 disabled:hover:bg-white',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400/30',
  destructive: 'bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus-visible:ring-rose-500/40',
  success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 focus-visible:ring-emerald-500/40',
}

const sizes: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1.5',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
  icon: 'h-9 w-9',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  active,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center rounded-lg font-medium outline-none transition-all duration-150 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        active && 'bg-indigo-600 text-white shadow-sm',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}