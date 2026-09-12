import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { ToastHost } from '../ui/Toast'

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-12">
        <Outlet />
      </main>
      <BottomNav />
      <ToastHost />
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <Outlet />
      <ToastHost />
    </div>
  )
}