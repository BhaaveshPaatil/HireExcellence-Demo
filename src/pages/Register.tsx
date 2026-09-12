import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'

export default function Register() {
  const { register } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [headline, setHeadline] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all the required fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('That email address does not look right.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    register({ name, email, password, headline: headline.trim() || undefined })
    navigate('/home')
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700 lg:block">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/register" className="flex items-center gap-2.5" aria-label="HireExcellence">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <UserPlus className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold tracking-tight">Join HireExcellence</span>
          </Link>

          <div>
            <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
              Your interview-prep superpower starts here.
            </h1>
            <div className="mt-8 grid max-w-md gap-4">
              {[
                { title: 'Track real progress', text: 'Problems solved, courses completed, interview scores — one dashboard.' },
                { title: 'Practice like it is real', text: 'Structured mock interviews with evaluation you can act on.' },
                { title: 'From learning to offers', text: 'Curated jobs for students and new grads, refreshed daily.' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/50">Free forever for students. No credit card required.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link to="/login" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to sign in
          </Link>

          <div className="mb-8 lg:hidden">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <UserPlus className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">HireExcellence</h2>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500">Start your journey to your first full-time tech role.</p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <Input
              id="reg-name"
              label="Full name"
              placeholder="e.g. Maya Johnson"
              icon={<User className="h-4 w-4" aria-hidden="true" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <Input
              id="reg-email"
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              id="reg-headline"
              label="Professional headline (optional)"
              placeholder="e.g. Final-year CS student · Aspiring Frontend Engineer"
              icon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <div className="relative">
              <Input
                id="reg-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                icon={<Lock className="h-4 w-4" aria-hidden="true" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full">
              Create free account
            </Button>

            <p className="text-center text-xs text-slate-400">
              By continuing you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}