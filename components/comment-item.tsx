"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface CommentItemProps {
  comment: any
  productId: string
  onReplySubmitted: (parentId: string, newReply: any) => void
  level?: number
}

export function CommentItem({ comment, productId, onReplySubmitted, level = 0 }: CommentItemProps) {
  const { data: session, update } = useSession()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const handleSubmitReply = async (parentId: string) => {
    if (!session?.user || !replyContent.trim() || isSubmittingReply) return
    setIsSubmittingReply(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          content: replyContent.trim(),
          parentId: parentId
        }),
      })
      if (response.ok) {
        const data = await response.json()
        onReplySubmitted(parentId, data.comment)
        setReplyContent('')
        setReplyingTo(null)
        await update()
        setTimeout(async () => { await update() }, 500)
      }
    } catch (error) { console.error('Error submitting reply:', error) }
    finally { setIsSubmittingReply(false) }
  }

  return (
    <div className={`${level > 0 ? 'pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <img
            src={comment.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face'}
            alt={comment.user?.name || 'Anonymous'}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-medium text-foreground text-sm">
            {comment.user?.name || comment.user?.username || 'Anonymous'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(comment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}
        </span>
      </div>
      <p className="text-foreground text-sm mb-2">{comment.content}</p>

      {/* Reply button */}
      {session?.user && (
        <div className="flex items-center space-x-4 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Reply
          </Button>
        </div>
      )}

      {/* Reply form */}
      {replyingTo === comment.id && (
        <div className="mt-3 pl-4 border-l-2 border-muted">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border border-border rounded-lg bg-background text-foreground resize-none text-sm"
            rows={2}
          />
          <div className="flex justify-end mt-2 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReplyingTo(null)
                setReplyContent('')
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyContent.trim() || isSubmittingReply}
            >
              {isSubmittingReply ? 'Posting...' : 'Reply'}
            </Button>
          </div>
        </div>
      )}

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              productId={productId}
              onReplySubmitted={onReplySubmitted}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
