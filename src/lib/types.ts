export interface Person {
  name: string
  headline: string
  initials: string
  avatarColor: string
}

export interface Comment {
  id: string
  author: Person
  text: string
  time: string
  likes: number
}

export interface Post {
  id: string
  author: Partial<Person> & { name: string }
  time: string
  content: string
  image?: string
  likes: number
  comments: Comment[]
  shares: number
  liked?: boolean
  saved?: boolean
}

export type JobType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract' | 'Remote'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  salary: string
  posted: string
  applicants: number
  tags: string[]
  logoColor: string
  about: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  recruiter: Person
  saved?: boolean
  applied?: boolean
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type ProblemStatus = 'solved' | 'attempted'

export interface TestCase {
  args: unknown[]
  expected: unknown
  explanation?: string
}

export interface CodingProblem {
  id: string
  title: string
  difficulty: Difficulty
  category: string
  acceptance: number
  companies: string[]
  frequency: number
  likes: number
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  starterCode: string
  solutionSignature: string
  testCases: TestCase[]
  status?: ProblemStatus
}

export interface InterviewQuestion {
  id: string
  prompt: string
  hint?: string
  skill: string
  type: 'coding' | 'behavioral' | 'system' | 'mcq'
  options?: string[]
  correctIndex?: number
  idealPoints: number
}

export interface InterviewAnswer {
  questionId: string
  answer: string
  durationSec: number
  skipped: boolean
}

export type InterviewStage = 'setup' | 'active' | 'completed'

export interface InterviewReport {
  id: string
  role: string
  level: string
  date: string
  overallScore: number
  accuracy: number
  completeness: number
  communication: number
  timeUsedSec: number
  questions: {
    questionId: string
    prompt: string
    skill: string
    score: number
    idealPoints: number
    feedback: string
    userAnswer: string
  }[]
  strengths: string[]
  improvements: string[]
  verdict: string
}

export interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'article' | 'quiz' | 'exercise'
  isFree: boolean
  completed?: boolean
}

export interface Course {
  id: string
  title: string
  tagline: string
  description: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  lessonsCount: number
  rating: number
  students: number
  updatedAt: string
  color: string
  topics: string[]
  instructor: Person
  lessons: Lesson[]
  saved?: boolean
  enrolled?: boolean
  enrolledProgress?: number
}

export interface FeedSuggestion extends Person {
  connect?: boolean
}

export type Category =
  | 'Home'
  | 'Jobs'
  | 'Practice'
  | 'Interview'
  | 'Learn'
  | 'Profile'