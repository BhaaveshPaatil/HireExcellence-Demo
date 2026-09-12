import { CheckCircle2, Info, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

export function ToastHost() {
  const { toasts } = useApp()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info
        return (
          <div
            key={toast.id}
            className={cn(
              'animate-fade-in-up pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg',
              toast.type === 'success' && 'bg-emerald-600',
              toast.type === 'error' && 'bg-rose-600',
              toast.type === 'info' && 'bg-slate-800',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {toast.message}
          </div>
        )
      })}
    </div>
  )
}