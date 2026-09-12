import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CodingProblem,
  Course,
  InterviewReport,
  Job,
  Person,
  Post,
  ProblemStatus,
} from '../lib/types'
import {
  currentUser,
  courses as seedCourses,
  initialPosts,
  jobs as seedJobs,
  problems as seedProblems,
} from '../data/mockData'

interface RegisterData {
  name: string
  email: string
  password: string
  headline?: string
}

interface AppContextValue {
  user: (Person & { email: string; location: string; about: string }) | null
  isAuthenticated: boolean
  posts: Post[]
  jobs: Job[]
  problems: CodingProblem[]
  courses: Course[]
  savedJobIds: string[]
  savedCourseIds: string[]
  enrolledCourseIds: string[]
  solvedProblemIds: string[]
  attemptedProblemIds: string[]
  report: InterviewReport | null
  toasts: { id: string; message: string; type: 'success' | 'info' | 'error' }[]

  login: (data: RegisterData) => void
  register: (data: RegisterData) => void
  logout: () => void
  updateProfile: (patch: Partial<RegisterData & { location: string; about: string }>) => void
  addPost: (content: string, image?: string) => void
  toggleLike: (postId: string) => void
  toggleSavePost: (postId: string) => void
  addComment: (postId: string, text: string) => void
  toggleSaveJob: (jobId: string) => void
  applyToJob: (jobId: string) => void
  markProblem: (problemId: string, status: ProblemStatus) => void
  toggleSaveCourse: (courseId: string) => void
  enrollCourse: (courseId: string) => void
  toggleLesson: (courseId: string, lessonId: string) => void
  setReport: (report: InterviewReport | null) => void
  notify: (message: string, type?: 'success' | 'info' | 'error') => void
}

const STORAGE_KEY = 'hireexcellence:state:v1'

interface PersistedState {
  solvedProblemIds: string[]
  attemptedProblemIds: string[]
  savedJobIds: string[]
  savedCourseIds: string[]
  enrolledCourseIds: string[]
  report: InterviewReport | null
  user: AppContextValue['user']
}

const AppContext = createContext<AppContextValue | null>(null)

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<PersistedState>) : {}
  } catch {
    return {}
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = useMemo(() => loadPersisted(), [])

  const [user, setUser] = useState<AppContextValue['user']>(persisted.user ?? null)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [jobs, setJobs] = useState<Job[]>(seedJobs)
  const [problems, setProblems] = useState<CodingProblem[]>(
    seedProblems.map((p) => {
      const status = (persisted.solvedProblemIds ?? []).includes(p.id)
        ? 'solved'
        : (persisted.attemptedProblemIds ?? []).includes(p.id)
          ? 'attempted'
          : undefined
      return { ...p, status }
    }),
  )
  const [courses, setCourses] = useState<Course[]>(
    seedCourses.map((c) => {
      const enrolled = (persisted.enrolledCourseIds ?? []).includes(c.id)
      return { ...c, enrolled, saved: (persisted.savedCourseIds ?? []).includes(c.id) }
    }),
  )
  const [savedJobIds, setSavedJobIds] = useState<string[]>(persisted.savedJobIds ?? [])
  const [report, setReport] = useState<InterviewReport | null>(persisted.report ?? null)
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([])

  useEffect(() => {
    const snapshot: PersistedState = {
      solvedProblemIds: problems.filter((p) => p.status === 'solved').map((p) => p.id),
      attemptedProblemIds: problems.filter((p) => p.status === 'attempted').map((p) => p.id),
      savedJobIds,
      savedCourseIds: courses.filter((c) => c.saved).map((c) => c.id),
      enrolledCourseIds: courses.filter((c) => c.enrolled).map((c) => c.id),
      report,
      user,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }, [problems, savedJobIds, courses, report, user])

  const notify = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const login = useCallback(
    (data: RegisterData) => {
      setUser({
        name: data.name || currentUser.name,
        email: data.email,
        headline: data.headline ?? currentUser.headline,
        initials: data.name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0]?.toUpperCase())
          .join('') || currentUser.initials,
        avatarColor: currentUser.avatarColor,
        location: currentUser.location,
        about: currentUser.about,
      })
      notify(`Welcome back, ${data.name.split(' ')[0] ?? 'there'}!`, 'success')
    },
    [notify],
  )

  const register = useCallback(
    (data: RegisterData) => {
      setUser({
        name: data.name,
        email: data.email,
        headline: data.headline ?? 'Aspiring Software Engineer',
        initials: data.name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0]?.toUpperCase())
          .join(''),
        avatarColor: currentUser.avatarColor,
        location: currentUser.location,
        about: currentUser.about,
      })
      notify(`Account created. Welcome, ${data.name.split(' ')[0]}!`, 'success')
    },
    [notify],
  )

  const logout = useCallback(() => {
    setUser(null)
    notify('You have been signed out.', 'info')
  }, [notify])

  const updateProfile = useCallback(
    (patch: Partial<RegisterData & { location: string; about: string }>) => {
      setUser((u) => (u ? { ...u, ...patch } : u))
      notify('Profile updated', 'success')
    },
    [notify],
  )

  const addPost = useCallback(
    (content: string, image?: string) => {
      const author: Person = {
        name: user?.name ?? currentUser.name,
        headline: user?.headline ?? currentUser.headline,
        initials: user?.initials ?? currentUser.initials,
        avatarColor: user?.avatarColor ?? currentUser.avatarColor,
      }
      const post: Post = {
        id: `post-${Date.now()}`,
        author,
        time: new Date().toISOString(),
        content,
        image,
        likes: 0,
        comments: [],
        shares: 0,
      }
      setPosts((p) => [post, ...p])
      notify('Post published', 'success')
    },
    [setPosts, user, notify],
  )

  const toggleLike = useCallback((postId: string) => {
    setPosts((list) =>
      list.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + (p.liked ? -1 : 1), liked: !p.liked } : p,
      ),
    )
  }, [])

  const toggleSavePost = useCallback((postId: string) => {
    setPosts((list) => list.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p)))
  }, [])

  const addComment = useCallback(
    (postId: string, text: string) => {
      if (!text.trim()) return
      const author: Person = {
        name: user?.name ?? currentUser.name,
        headline: user?.headline ?? '',
        initials: user?.initials ?? currentUser.initials,
        avatarColor: user?.avatarColor ?? 'bg-indigo-500',
      }
      setPosts((list) =>
        list.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  { id: `c-${Date.now()}`, author, text: text.trim(), time: 'Just now', likes: 0 },
                ],
              }
            : p,
        ),
      )
      notify('Comment posted', 'success')
    },
    [setPosts, user, notify],
  )

  const toggleSaveJob = useCallback(
    (jobId: string) => {
      setSavedJobIds((ids) => {
        const has = ids.includes(jobId)
        notify(has ? 'Removed from saved jobs' : 'Job saved', has ? 'info' : 'success')
        return has ? ids.filter((id) => id !== jobId) : [...ids, jobId]
      })
    },
    [notify],
  )

  const applyToJob = useCallback(
    (jobId: string) => {
      setJobs((list) => (list.some((j) => j.id === jobId && j.applied) ? list : list.map((j) => (j.id === jobId ? { ...j, applied: true } : j))))
      notify('Application submitted 🎉', 'success')
    },
    [notify],
  )

  const markProblem = useCallback((problemId: string, status: ProblemStatus) => {
    setProblems((list) => list.map((p) => (p.id === problemId ? { ...p, status } : p)))
  }, [])

  const toggleSaveCourse = useCallback(
    (courseId: string) => {
      setCourses((list) => {
        const next = list.map((c2) => (c2.id === courseId ? { ...c2, saved: !c2.saved } : c2))
        const saved = next.find((c2) => c2.id === courseId)?.saved
        notify(saved ? 'Course saved to wishlist' : 'Removed from wishlist', saved ? 'success' : 'info')
        return next
      })
    },
    [notify],
  )

  const enrollCourse = useCallback(
    (courseId: string) => {
      setCourses((list) =>
        list.map((c2) => (c2.id === courseId ? { ...c2, enrolled: true, enrolledProgress: c2.enrolledProgress ?? 0 } : c2)),
      )
      notify('Enrolled! Let’s get started 🎓', 'success')
    },
    [notify],
  )

  const toggleLesson = useCallback((courseId: string, lessonId: string) => {
    setCourses((list) =>
      list.map((c2) => {
        if (c2.id !== courseId) return c2
        const completed = c2.lessons.some((l) => l.id === lessonId && l.completed)
        const lessons = c2.lessons.map((l) => (l.id === lessonId ? { ...l, completed: !completed } : l))
        const completedCount = lessons.filter((l) => l.completed).length
        return {
          ...c2,
          lessons,
          enrolledProgress: Math.round((completedCount / lessons.length) * 100),
        }
      }),
    )
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      posts,
      jobs,
      problems,
      courses,
      savedJobIds,
      savedCourseIds: courses.filter((c2) => c2.saved).map((c2) => c2.id),
      enrolledCourseIds: courses.filter((c2) => c2.enrolled).map((c2) => c2.id),
      solvedProblemIds: problems.filter((p) => p.status === 'solved').map((p) => p.id),
      attemptedProblemIds: problems.filter((p) => p.status === 'attempted').map((p) => p.id),
      report,
      toasts,
      login,
      register,
      logout,
      updateProfile,
      addPost,
      toggleLike,
      toggleSavePost,
      addComment,
      toggleSaveJob,
      applyToJob,
      markProblem,
      toggleSaveCourse,
      enrollCourse,
      toggleLesson,
      setReport,
      notify,
    }),
    [
      user,
      posts,
      jobs,
      problems,
      courses,
      savedJobIds,
      report,
      toasts,
      login,
      register,
      logout,
      updateProfile,
      addPost,
      toggleLike,
      toggleSavePost,
      addComment,
      toggleSaveJob,
      applyToJob,
      markProblem,
      toggleSaveCourse,
      enrollCourse,
      toggleLesson,
      notify,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}