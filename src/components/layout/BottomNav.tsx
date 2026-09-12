import { NavLink } from 'react-router-dom'
import { Briefcase, BookOpen, Dumbbell, Home, Mic } from 'lucide-react'
import { cn } from '../../lib/utils'

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/interview', label: 'Interview', icon: Mic },
  { to: '/learn', label: 'Learn', icon: BookOpen },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800',
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}