import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Briefcase,
  Dumbbell,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Mic,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/interview', label: 'AI Interview', icon: Mic },
  { to: '/learn', label: 'Learn', icon: BookOpen },
]

export function Navbar() {
  const { user, isAuthenticated, logout } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/home" className="flex shrink-0 items-center gap-2" aria-label="HireExcellence home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
            <Dumbbell className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-slate-900 sm:block">
            Hire<span className="text-indigo-600">Excellence</span>
          </span>
        </Link>

        <div className="relative mx-auto hidden max-w-sm flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search jobs, people, courses…"
            aria-label="Search"
            className="w-full rounded-full border border-slate-200 bg-slate-100 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="hidden items-center md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
                )
              }
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 sm:flex"
            aria-label="Messages (3 unread)"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-1 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
              >
                <Avatar initials={user.initials} color={user.avatarColor} size="sm" alt={user.name} />
              </button>
              {menuOpen ? (
                <div
                  role="menu"
                  className="animate-fade-in-up absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <MenuLink to="/profile" icon={<User className="h-4 w-4" />} label="Your profile" onClose={() => setMenuOpen(false)} />
                  <MenuLink to="/profile" icon={<Settings className="h-4 w-4" />} label="Settings" onClose={() => setMenuOpen(false)} />
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden h-9 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 sm:flex"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                  <Dumbbell className="h-4 w-4" aria-hidden="true" />
                </span>
                HireExcellence
              </span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3" aria-label="Mobile sections">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="mt-2 flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Sign in
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function MenuLink({
  to,
  icon,
  label,
  onClose,
}: {
  to: string
  icon: React.ReactNode
  label: string
  onClose: () => void
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClose}
      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
    >
      {icon}
      {label}
    </Link>
  )
}