import { cn } from '../../lib/utils'

const sizes = {
  xs: 'h-8 w-8 text-xs',
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
}

export function Avatar({
  initials,
  color = 'bg-indigo-500',
  size = 'md',
  className,
  alt,
}: {
  initials: string
  color?: string
  size?: keyof typeof sizes
  className?: string
  alt?: string
}) {
  return (
    <span
      role="img"
      aria-label={alt ?? initials}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ring-2 ring-white',
        color,
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  )
}