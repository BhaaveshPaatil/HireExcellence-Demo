import { useState } from 'react'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Send } from 'lucide-react'
import type { Post } from '../../lib/types'
import { timeAgo } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

export function PostCard({
  post,
  onLike,
  onSave,
  onComment,
}: {
  post: Post
  onLike: () => void
  onSave: () => void
  onComment: (text: string) => void
}) {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  const submit = () => {
    if (!comment.trim()) return
    onComment(comment)
    setComment('')
    setShowComments(true)
  }

  return (
    <article className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-start gap-3 px-4 pt-4">
        <Avatar initials={post.author.initials ?? ''} color={post.author.avatarColor} size="sm" alt={post.author.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{post.author.name}</p>
          <p className="truncate text-xs text-slate-500">{post.author.headline}</p>
          <p className="text-xs text-slate-400">{timeAgo(post.time)}</p>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <p className="whitespace-pre-line px-4 py-3 text-[15px] leading-relaxed text-slate-800">{post.content}</p>

      {post.image ? (
        <div className={cn('h-44 -mt-1 sm:h-56', post.image)} aria-hidden="true" />
      ) : null}

      <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="flex -space-x-1" aria-hidden="true">
            <span className="h-4 w-4 rounded-full bg-rose-500 border border-white" />
            <span className="h-4 w-4 rounded-full bg-indigo-500 border border-white" />
            <span className="h-4 w-4 rounded-full bg-emerald-500 border border-white" />
          </span>
          {post.likes.toLocaleString()}
        </span>
        <span>{post.comments.length.toLocaleString()} comments · {post.shares.toLocaleString()} shares</span>
      </div>

      <div className="flex items-center border-t border-slate-100 px-2 py-1">
        <Button variant="ghost" size="sm" className="flex-1" onClick={onLike} aria-pressed={post.liked}>
          <Heart className={cn('h-4 w-4', post.liked && 'fill-rose-500 text-rose-500')} aria-hidden="true" />
          <span className={post.liked ? 'text-rose-600' : ''}>Like</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => setShowComments((s) => !s)}
          aria-expanded={showComments}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          <Repeat2 className="h-4 w-4" aria-hidden="true" />
          Repost
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" onClick={onSave} aria-pressed={post.saved}>
          <Bookmark className={cn('h-4 w-4', post.saved && 'fill-indigo-600 text-indigo-600')} aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Save</span>
        </Button>
      </div>

      {showComments ? (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
          <div className="space-y-3">
            {post.comments.map((commentItem) => (
              <div key={commentItem.id} className="flex items-start gap-2.5">
                <Avatar initials={commentItem.author.initials} color={commentItem.author.avatarColor} size="xs" alt={commentItem.author.name} />
                <div className="flex-1 rounded-xl bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900">{commentItem.author.name}</p>
                    <span className="text-[11px] text-slate-400">{commentItem.time}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-700">{commentItem.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Avatar initials={post.author.initials ?? ''} color={post.author.avatarColor} size="xs" alt={post.author.name} />
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit()
                }}
                placeholder="Add a comment…"
                aria-label="Add a comment"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <Button variant="ghost" size="icon" onClick={submit} className="h-8 w-8" aria-label="Post comment">
                <Send className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  )
}