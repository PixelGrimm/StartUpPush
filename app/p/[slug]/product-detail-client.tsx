"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Share2, MessageCircle, Calendar, User, ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { formatNumber } from '@/lib/utils'
import { BoostBadge } from '@/components/boost-badge'
import { CommentItem } from '@/components/comment-item'
import { ErrorModal } from '@/components/ui/error-modal'

interface ProductDetailClientProps {
  product: any
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { data: session, update } = useSession()
  const [userVote, setUserVote] = useState<number | null>(product.userVote || null)
  const [isVoting, setIsVoting] = useState(false)
  const [comments, setComments] = useState(product.comments || [])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [boostStatus, setBoostStatus] = useState<{ type: 'boosted' | 'max-boosted', endDate: string } | null>(null)
  const [voteCounts, setVoteCounts] = useState({
    upvotes: product.upvotes || 0,
    downvotes: product.downvotes || 0,
    totalVotes: product.totalVotes || 0
  })
  const [projectUpdates, setProjectUpdates] = useState<any[]>([])
  const [loadingUpdates, setLoadingUpdates] = useState(true)
  const [similarProjects, setSimilarProjects] = useState<any[]>([])
  const [loadingSimilar, setLoadingSimilar] = useState(true)
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string; title: string }>({
    isOpen: false,
    message: '',
    title: ''
  })

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.tagline,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        setErrorModal({
          isOpen: true,
          title: 'Success',
          message: 'Link copied to clipboard!'
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setErrorModal({
          isOpen: true,
          title: 'Success',
          message: 'Link copied to clipboard!'
        })
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError)
        setErrorModal({
          isOpen: true,
          title: 'Error',
          message: 'Failed to share. Please copy the URL manually.'
        })
      }
    }
  }

  // Fetch boost status and project updates
  useEffect(() => {
    const fetchBoostStatus = async () => {
      try {
        const response = await fetch(`/api/promotions?productId=${product.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.promotion) {
            setBoostStatus({
              type: data.promotion.type as 'boosted' | 'max-boosted',
              endDate: data.promotion.endDate
            })
          }
        }
      } catch (error) {
        console.error('Error fetching boost status:', error)
      }
    }

    const fetchProjectUpdates = async () => {
      try {
        const response = await fetch(`/api/updates?projectId=${product.id}`)
        if (response.ok) {
          const data = await response.json()
          setProjectUpdates(data.updates || [])
        }
      } catch (error) {
        console.error('Error fetching project updates:', error)
      } finally {
        setLoadingUpdates(false)
      }
    }

    const fetchSimilarProjects = async () => {
      try {
        const response = await fetch(`/api/products?category=${product.category}&exclude=${product.id}&limit=4`)
        if (response.ok) {
          const data = await response.json()
          setSimilarProjects(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching similar projects:', error)
      } finally {
        setLoadingSimilar(false)
      }
    }

    fetchBoostStatus()
    fetchProjectUpdates()
    fetchSimilarProjects()
  }, [product.id])

  const handleVote = async (value: number) => {
    if (!session?.user || isVoting) return

    setIsVoting(true)
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          value: value
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Vote response:', data)
        setUserVote(data.userVote)
        // Update the vote counts
        if (data.upvotes !== undefined && data.downvotes !== undefined) {
          console.log('Updating vote counts:', { upvotes: data.upvotes, downvotes: data.downvotes, totalVotes: data.totalVotes })
          setVoteCounts({
            upvotes: data.upvotes,
            downvotes: data.downvotes,
            totalVotes: data.totalVotes
          })
        } else {
          console.log('No vote counts in response:', data)
        }
        
        // Refresh session to update user points in header
        await update()
        
        // Force a small delay and refresh again to ensure points are updated
        setTimeout(async () => {
          await update()
        }, 500)
        
        // Show success message
        setErrorModal({
          isOpen: true,
          title: 'Vote Successful',
          message: value === 1 ? 'Upvote recorded!' : 'Downvote recorded!'
        })
      } else {
        const errorData = await response.json()
        console.error('Vote failed:', errorData)
        setErrorModal({
          isOpen: true,
          title: 'Vote Failed',
          message: errorData.error || 'Failed to vote. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!session?.user || !newComment.trim() || isSubmittingComment) return

    setIsSubmittingComment(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          content: newComment.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Comment response:', data)
        setComments([data.comment, ...comments])
        setNewComment('')
        
        // Refresh session to update user points in header
        await update()
        
        // Force a small delay and refresh again to ensure points are updated
        setTimeout(async () => {
          await update()
        }, 500)
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!session?.user || !replyContent.trim() || isSubmittingReply) return

    setIsSubmittingReply(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          content: replyContent.trim(),
          parentId: parentId
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Reply response:', data)
        
        // Update the comments to include the new reply
        setComments((prevComments: any[]) => 
          prevComments.map(comment => 
            comment.id === parentId 
              ? { ...comment, replies: [...(comment.replies || []), data.comment] }
              : comment
          )
        )
        
        setReplyContent('')
        setReplyingTo(null)
        
        // Refresh session to update user points in header
        await update()
        
        // Force a small delay and refresh again to ensure points are updated
        setTimeout(async () => {
          await update()
        }, 500)
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Home
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <img
                src={product.logo || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop'}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {product.name}
                  </h1>
                  {boostStatus && (
                    <BoostBadge
                      planType={boostStatus.type}
                      endDate={boostStatus.endDate}
                    />
                  )}
                </div>
                <p className="text-xl text-muted-foreground mb-2">
                  {product.tagline}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {product.user?.name || 'Anonymous'}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Published on {new Date(product.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button asChild size="sm">
                <a href={product.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit site
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">🔥 {formatNumber((voteCounts.upvotes * 10) - (voteCounts.downvotes * 5))}</div>
              <div className="text-sm text-muted-foreground">StartUpPush</div>
            </div>
            <div className="text-center">
              {session?.user && (
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Button
                    variant={userVote === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote(1)}
                    disabled={isVoting}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <div className="text-2xl font-bold text-foreground">{formatNumber(voteCounts.totalVotes)}</div>
                  <Button
                    variant={userVote === -1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote(-1)}
                    disabled={isVoting}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!session?.user && (
                <div className="text-2xl font-bold text-foreground">{formatNumber(voteCounts.totalVotes)}</div>
              )}
              <div className="text-sm text-muted-foreground">Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {product.mrr ? `$${formatNumber(product.mrr)}` : '-'}
              </div>
              <div className="text-sm text-muted-foreground">MRR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {product.isPromoted ? '💎' : '🏆'}
              </div>
              <div className="text-sm text-muted-foreground">
                {product.isPromoted ? (
                  <span className="promoted-badge">Promoted</span>
                ) : (
                  'Featured'
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/categories/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-muted hover:bg-muted/80 text-foreground px-3 py-1 rounded-full text-sm transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">About {product.name}</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="text-foreground whitespace-pre-line">{product.description}</div>
          </div>
        </div>

        {/* Screenshots/Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Project Screenshots</h2>
          {product.screenshots && Array.isArray(product.screenshots) && product.screenshots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.screenshots.map((screenshot: string, index: number) => (
                <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
                  <img
                    src={screenshot}
                    alt={`${product.name} screenshot ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No screenshots available for this project.</p>
            </div>
          )}
        </div>

        {/* Project Updates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Project Updates ({projectUpdates.length})</h2>
          
          {loadingUpdates ? (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-muted-foreground">Loading updates...</p>
            </div>
          ) : projectUpdates.length > 0 ? (
            <div className="space-y-4">
              {projectUpdates.map((update) => (
                <div key={update.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={update.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                        alt={update.user?.name || 'Anonymous'}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{update.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {update.user?.name || update.user?.username || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <p>{update.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No updates yet. Check back later for updates from the team.</p>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Comments ({(() => {
            const countAllComments = (commentList: any[]): number => {
              return commentList.reduce((total, comment) => {
                let count = 1 // Count the main comment
                if (comment.replies && comment.replies.length > 0) {
                  count += countAllComments(comment.replies) // Recursively count nested replies
                }
                return total + count
              }, 0)
            }
            return countAllComments(comments)
          })()})</h2>
          
          {/* Add Comment Form */}
          {session?.user && (
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment.id} className="bg-card border border-border rounded-lg p-4">
                  <CommentItem
                    comment={comment}
                    productId={product.id}
                    onReplySubmitted={(parentId, newReply) => {
                      const updateCommentReplies = (comments: any[], targetId: string, newReply: any): any[] => {
                        return comments.map(comment => {
                          if (comment.id === targetId) {
                            return { ...comment, replies: [...(comment.replies || []), newReply] }
                          }
                          if (comment.replies && comment.replies.length > 0) {
                            return { ...comment, replies: updateCommentReplies(comment.replies, targetId, newReply) }
                          }
                          return comment
                        })
                      }
                      
                      setComments((prevComments: any[]) => updateCommentReplies(prevComments, parentId, newReply))
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">No comments yet.</p>
              {!session?.user && (
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Sign in to comment
                  </Link>
                </Button>
              )}
            </div>
          )}
                </div>

        {/* You may also like - Real projects */}
        {similarProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">You may also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {similarProjects.map((similarProject) => (
                <Link
                  key={similarProject.id}
                  href={`/p/${similarProject.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    {similarProject.logo ? (
                      <img
                        src={similarProject.logo}
                        alt={similarProject.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground font-semibold text-sm">
                          {similarProject.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{similarProject.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{similarProject.tagline}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>🔥 {similarProject._count.votes}</span>
                        <span>👍 {similarProject.votes.filter(v => v.value === 1).length}</span>
                        {similarProject.mrr && <span>${similarProject.mrr} MRR</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error/Success Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '', title: '' })}
        title={errorModal.title}
        message={errorModal.message}
        buttonText="OK"
      />
    </div>
  )
}
