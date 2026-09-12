import { Link } from 'react-router-dom'
import { Award, Briefcase, ChevronRight, Flame, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { currentUser, suggestedConnections, trendingTopics } from '../data/mockData'
import { Avatar } from '../components/ui/Avatar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PostCard } from '../components/feed/PostCard'
import { PostComposer } from '../components/feed/PostComposer'
import { formatNumber } from '../lib/utils'

export default function Home() {
  const {
    user,
    posts,
    toggleLike,
    toggleSavePost,
    addComment,
    solvedProblemIds,
    enrolledCourseIds,
  } = useApp()
  const profile = user ?? currentUser

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,20rem)_1fr_minmax(0,20rem)]">
      {/* Left rail */}
      <aside className="hidden space-y-4 lg:block">
        <Card>
          <Link to="/profile" className="block">
            <div className={`h-20 rounded-t-2xl ${currentUser.bannerColor}`} aria-hidden="true" />
            <div className="-mt-10 flex flex-col items-center px-4 pb-4">
              <Avatar initials={profile.initials} color={profile.avatarColor} size="xl" alt={profile.name} />
              <h2 className="mt-3 text-lg font-bold text-slate-900">{profile.name}</h2>
              <p className="mt-0.5 line-clamp-2 text-center text-xs text-slate-500">{profile.headline}</p>
            </div>
          </Link>
          <div className="grid grid-cols-2 border-t border-slate-100 text-center">
            <div className="border-r border-slate-100 px-2 py-3">
              <p className="text-sm font-bold text-slate-900">312</p>
              <p className="text-[11px] text-slate-500">Problems solved</p>
            </div>
            <div className="px-2 py-3">
              <p className="text-sm font-bold text-slate-900">{formatNumber((profile as typeof currentUser).stats.followers)}</p>
              <p className="text-[11px] text-slate-500">Followers</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">People you may know</h2>
          <div className="space-y-1 p-3">
            {suggestedConnections.map((person) => (
              <div key={person.name} className="flex items-center gap-3 rounded-xl px-2 py-2">
                <Avatar initials={person.initials} color={person.avatarColor} size="sm" alt={person.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{person.name}</p>
                  <p className="truncate text-xs text-slate-500">{person.headline}</p>
                </div>
                <Button variant="outline" size="xs">Connect</Button>
              </div>
            ))}
          </div>
        </Card>
      </aside>

      {/* Main feed */}
      <section className="space-y-4" aria-label="Your feed">
        <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white" aria-hidden="true">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">6-day streak! Keep it going</p>
              <p className="text-xs text-slate-500">You improved 12% vs last week</p>
            </div>
          </div>
          <Link to="/practice" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Practice <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <PostComposer />

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => toggleLike(post.id)}
            onSave={() => toggleSavePost(post.id)}
            onComment={(text) => addComment(post.id, text)}
          />
        ))}
      </section>

      {/* Right rail */}
      <aside className="hidden space-y-4 lg:block">
        <Card>
          <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
            <Award className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Skill badges
          </h2>
          <div className="space-y-3 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600" aria-hidden="true"><Award className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold">DSA · Arrays</p>
                  <p className="text-[11px] text-slate-500">84% mastery</p>
                </div>
              </div>
              <Badge tone="success">Gold</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600" aria-hidden="true"><Award className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold">React</p>
                  <p className="text-[11px] text-slate-500">67% mastery</p>
                </div>
              </div>
              <Badge tone="info">Silver</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Keep learning</h2>
          <div className="space-y-2 p-3">
            {[
              { title: 'DSA Patterns Bootcamp', progress: 64, color: 'bg-indigo-600' },
              { title: 'System Design Interview Prep', progress: 12, color: 'bg-indigo-600' },
            ].map((c) => {
              return (
                <Link key={c.title} to={c.progress > 35 ? '/learn/c1' : '/learn/c2'} className="block rounded-xl p-2 transition-colors hover:bg-slate-50">
                  <div className={`h-14 rounded-lg ${c.color}`} aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-slate-900">{c.title}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${c.progress}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">{c.progress}% complete</p>
                </Link>
              )
            })}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            Trending
          </h2>
          <div className="space-y-2.5 px-5 py-4">
            {trendingTopics.map((t) => (
              <button key={t.tag} type="button" className="block w-full text-left">
                <p className="text-sm font-semibold text-slate-800 hover:text-indigo-600">{t.tag}</p>
                <p className="text-xs text-slate-400">{t.posts} posts today</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600" aria-hidden="true">
              <Briefcase className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">8 jobs match your profile</p>
              <p className="text-xs text-slate-500">{solvedProblemIds.length} challenges completed · {enrolledCourseIds.length} courses</p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <Link to="/jobs">
              <Button variant="secondary" className="w-full">Browse jobs</Button>
            </Link>
          </div>
        </Card>
      </aside>
    </div>
  )
}