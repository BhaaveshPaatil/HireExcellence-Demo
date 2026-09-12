import { useState } from 'react'
import { Image, Video, CalendarDays, FileText, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

const imageColors = ['bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700']

export function PostComposer() {
  const { user, addPost } = useApp()
  const [text, setText] = useState('')
  const [image, setImage] = useState<string | null>(null)

  const submit = () => {
    if (!text.trim()) return
    addPost(text, image ?? undefined)
    setText('')
    setImage(null)
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar initials={user?.initials ?? 'U'} color={user?.avatarColor ?? 'bg-indigo-500'} size="sm" alt="You" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your learning, questions, or wins with the community…"
          aria-label="Write a post"
          rows={image ? 1 : 2}
          className="min-h-[52px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {image ? (
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <div className={cn('h-36 w-full sm:h-44', image)} aria-hidden="true" />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white hover:bg-slate-900"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="absolute bottom-2 left-3 rounded-full bg-slate-900/50 px-3 py-1 text-xs font-medium text-white">
            Post image
          </span>
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImage(image ? null : imageColors[Math.floor(Math.random() * imageColors.length)])}
            aria-label="Add image"
          >
            <Image className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="hidden sm:inline">Photo</span>
          </Button>
          <Button variant="ghost" size="sm" aria-label="Add video">
            <Video className="h-4 w-4 text-violet-600" aria-hidden="true" />
            <span className="hidden sm:inline">Video</span>
          </Button>
          <Button variant="ghost" size="sm" aria-label="Add event">
            <CalendarDays className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            <span className="hidden sm:inline">Event</span>
          </Button>
          <Button variant="ghost" size="sm" aria-label="Write article">
            <FileText className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span className="hidden sm:inline">Article</span>
          </Button>
        </div>
        <Button size="sm" onClick={submit} disabled={!text.trim()}>
          Post
        </Button>
      </div>
    </div>
  )
}