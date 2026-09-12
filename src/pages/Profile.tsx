import { useState } from 'react'
import {
  Award,
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  Download,
  Edit3,
  GraduationCap,
  MapPin,
  Plus,
  Share2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { currentUser } from '../data/mockData'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Tabs } from '../components/ui/Tabs'
import { Input, Textarea } from '../components/ui/Field'
import { PostCard } from '../components/feed/PostCard'
import { formatNumber } from '../lib/utils'

export default function Profile() {
  const { user, posts, toggleLike, toggleSavePost, addComment, updateProfile } = useApp()
  const profile = user ?? currentUser
  const [tab, setTab] = useState('overview')
  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(profile.name)
  const [headline, setHeadline] = useState(profile.headline)
  const [location, setLocation] = useState(profile.location)
  const [about, setAbout] = useState(profile.about)

  const myPosts = posts.filter((p) => p.author.name === profile.name)

  const saveProfile = () => {
    updateProfile({ name, headline, location, about })
    setEditOpen(false)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Banner + header */}
      <Card className="overflow-hidden">
        <div className={`h-36 sm:h-44 ${currentUser.bannerColor}`} aria-hidden="true" />
        <div className="px-6 pb-6">
          <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar initials={profile.initials} color={profile.avatarColor} size="xl" className="h-28 w-28 text-3xl" alt={profile.name} />
              <div className="pb-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{profile.name}</h1>
                <p className="mt-0.5 text-sm text-slate-600">{profile.headline}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {profile.location}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <Button variant="outline" size="sm"><Share2 className="h-4 w-4" aria-hidden="true" />Share</Button>
              <Button variant="outline" size="sm"><Download className="h-4 w-4" aria-hidden="true" />Save PDF</Button>
              <Button size="sm" onClick={() => setEditOpen(true)}><Edit3 className="h-4 w-4" aria-hidden="true" />Edit</Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {[
              { icon: <Briefcase className="h-4 w-4" aria-hidden="true" />, label: 'Experience', value: '2 internships' },
              { icon: <GraduationCap className="h-4 w-4" aria-hidden="true" />, label: 'Education', value: 'B.S. Computer Science' },
              { icon: <Award className="h-4 w-4" aria-hidden="true" />, label: 'Achievements', value: '312 challenges' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400">{s.icon}</span>
                <span><span className="font-semibold text-slate-900">{s.value}</span> · {s.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {currentUser.skills.slice(0, 8).map((skill) => (
              <Badge key={skill} tone="primary">{skill}</Badge>
            ))}
            <Badge tone="neutral"><Plus className="h-3 w-3" aria-hidden="true" />8 more</Badge>
          </div>
        </div>
      </Card>

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'activity', label: 'Activity', count: myPosts.length },
          { id: 'experience', label: 'Experience' },
          { id: 'education', label: 'Education' },
        ]}
        active={tab}
        onChange={setTab}
        className="rounded-t-2xl border-x border-t border-slate-200/80 bg-white px-2 shadow-sm"
      />

      {tab === 'overview' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">About</h2>
              <p className="whitespace-pre-line px-5 py-4 text-sm leading-relaxed text-slate-600">{profile.about}</p>
            </Card>

            <Card>
              <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
                <Briefcase className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                Experience
              </h2>
              <div className="space-y-5 p-5">
                {currentUser.experience.map((exp) => (
                  <div key={exp.role} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500" aria-hidden="true">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{exp.role}</p>
                      <p className="text-sm text-slate-600">{exp.company}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {exp.period}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="grid grid-cols-3 divide-x divide-slate-100 text-center">
              {[
                { label: 'Connections', value: (profile as typeof currentUser).stats.connections },
                { label: 'Followers', value: (profile as typeof currentUser).stats.followers },
                { label: 'Following', value: (profile as typeof currentUser).stats.following },
              ].map((s) => (
                <div key={s.label} className="px-2 py-5">
                  <p className="text-xl font-bold text-slate-900">{formatNumber(s.value)}</p>
                  <p className="text-[11px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </Card>

            <Card>
              <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Education</h2>
              <div className="space-y-4 p-5">
                {currentUser.education.map((edu) => (
                  <div key={edu.school} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600" aria-hidden="true">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{edu.school}</p>
                      <p className="text-sm text-slate-600">{edu.degree}</p>
                      <p className="text-xs text-slate-400">{edu.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="flex items-center gap-2 px-5 pt-5 text-base font-semibold text-slate-900">
                <Bookmark className="h-5 w-5 text-slate-400" aria-hidden="true" />
                Saved posts
              </h2>
              <div className="p-5">
                <p className="text-sm text-slate-500">You haven’t saved any posts yet.</p>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === 'activity' ? (
        <div className="mx-auto max-w-3xl space-y-4">
          {myPosts.length === 0 ? (
            <Card className="p-10 text-center text-sm text-slate-500">No activity yet. Share something with the community!</Card>
          ) : (
            myPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => toggleLike(post.id)}
                onSave={() => toggleSavePost(post.id)}
                onComment={(text) => addComment(post.id, text)}
              />
            ))
          )}
        </div>
      ) : null}

      {tab === 'experience' ? (
        <Card className="mx-auto max-w-3xl">
          <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Work experience</h2>
          <div className="space-y-5 p-5">
            {currentUser.experience.map((exp) => (
              <div key={exp.role} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500" aria-hidden="true">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{exp.role}</p>
                  <p className="text-sm text-slate-600">{exp.company}</p>
                  <p className="text-xs text-slate-400">{exp.period}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'education' ? (
        <Card className="mx-auto max-w-3xl">
          <h2 className="px-5 pt-5 text-base font-semibold text-slate-900">Education</h2>
          <div className="space-y-5 p-5">
            {currentUser.education.map((edu) => (
              <div key={edu.school} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600" aria-hidden="true">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{edu.school}</p>
                  <p className="text-sm text-slate-600">{edu.degree}</p>
                  <p className="text-xs text-slate-400">{edu.period}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        subtitle="Changes are saved locally on this device."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveProfile} disabled={!name.trim()}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input id="profile-name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input id="profile-headline" label="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <Input id="profile-location" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Textarea id="profile-about" label="About" rows={5} value={about} onChange={(e) => setAbout(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}