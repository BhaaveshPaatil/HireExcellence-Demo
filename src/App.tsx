import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout, AuthLayout } from './components/layout/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import PracticeDashboard from './pages/PracticeDashboard'
import CodingProblem from './pages/CodingProblem'
import AIInterview from './pages/AIInterview'
import InterviewReport from './pages/InterviewReport'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import { AppProvider } from './context/AppContext'
import { Button } from './components/ui/Button'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-black tracking-tight text-indigo-600">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/home" className="mt-6">
        <Button size="lg">Back to home</Button>
      </Link>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/practice" element={<PracticeDashboard />} />
            <Route path="/practice/:id" element={<CodingProblem />} />
            <Route path="/interview" element={<AIInterview />} />
            <Route path="/interview/report" element={<InterviewReport />} />
            <Route path="/learn" element={<Courses />} />
            <Route path="/learn/:id" element={<CourseDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App