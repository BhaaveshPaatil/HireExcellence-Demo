import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Dumbbell, Eye, EyeOff, GraduationCap, Lock, Mail, Sparkles, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('SNAB')
  const [email, setEmail] = useState('snab@hirex.dev')
  const [password, setPassword] = useState('hirexcellent')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields to continue.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('That email address does not look right.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    login({ name, email, password })
    navigate('/home')
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden brand-surface lg:block">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/login" className="flex items-center gap-2.5" aria-label="HireExcellence">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Dumbbell className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold tracking-tight">HireExcellence</span>
          </Link>

          <div>
            <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
              Practice. Learn. <span className="text-white/80">Get hired.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/80">
              One platform for coding practice, AI mock interviews, job hunting, and skill courses — built for students.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: <Dumbbell className="h-5 w-5" aria-hidden="true" />, text: '300+ hand-picked DSA problems with live judges' },
                { icon: <Sparkles className="h-5 w-5" aria-hidden="true" />, text: 'AI mock interviews with instant, detailed reports' },
                { icon: <GraduationCap className="h-5 w-5" aria-hidden="true" />, text: 'Role-based courses from beginner to advanced' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">{item.icon}</span>
                  <span className="text-sm font-medium text-white/90">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">Demo app — all data is stored locally in your browser.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link to="/home" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to app
          </Link>

          <div className="mb-8 lg:hidden">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Dumbbell className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">HireExcellence</h2>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue your interview prep streak. 🔥</p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <Input
              id="login-name"
              label="Full name"
              placeholder="SNAB"
              icon={<User className="h-4 w-4" aria-hidden="true" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" aria-hidden="true" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30" />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </button>
            </div>

            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New to HireExcellence?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}