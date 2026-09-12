import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      aria-label="Sections"
      className={cn('flex flex-wrap items-center gap-1 border-b border-slate-200', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/40',
              isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {tab.icon}
            {tab.label}
            {typeof tab.count === 'number' ? (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500',
                )}
              >
                {tab.count}
              </span>
            ) : null}
            {isActive ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-indigo-600" aria-hidden="true" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}