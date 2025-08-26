"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { AlertModal } from '@/components/ui/alert-modal'
import { useSession } from 'next-auth/react'
import { BoostBadge } from '@/components/boost-badge'
import { BoostButton } from '@/components/boost-button'
import { BoostCounter } from '@/components/boost-counter'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    tagline: string
    description: string
    website: string
    logo?: string
    tags: string[] | string
    mrr?: number
    isPromoted?: boolean
    createdAt: string
    userId: string
    _count: {
      votes: number
      comments: number
    }
    votes?: Array<{
      value: number
      userId: string
    }>
    promotions?: Array<{
      id: string
      type: string
      startDate: string
      endDate: string
      isActive: boolean
    }>
  }
  userVote: number | null
  onVote?: (productId: string, value: number) => void
  showPromoted?: boolean
}

export function ProjectCard({ project, userVote, onVote, showPromoted = true }: ProjectCardProps) {
  // Only log if userVote is null (haven't voted on this project)
  if (userVote === null) {
    console.log('🎯 Found project you can vote on:', { projectId: project.id, projectName: project.name })
  }
  
  const { update } = useSession()
  const [isVoting, setIsVoting] = useState(false)
  const [currentUserVote, setCurrentUserVote] = useState(userVote)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [lastVoteTime, setLastVoteTime] = useState(0)
  const [boostStatus, setBoostStatus] = useState<{ type: 'boosted' | 'max-boosted', endDate: string } | null>(null)

  // Update currentUserVote when userVote prop changes
  useEffect(() => {
    setCurrentUserVote(userVote)
  }, [userVote])

  // Set boost status from project data
  useEffect(() => {
    if (project.promotions && project.promotions.length > 0) {
      const boost = project.promotions[0]
      setBoostStatus({
        type: boost.type as 'boosted' | 'max-boosted',
        endDate: boost.endDate
      })
    } else {
      setBoostStatus(null)
    }
  }, [project.promotions])

  // Calculate vote counts from project data
  const voteCounts = useMemo(() => {
    // Debug vote data for Slack specifically
    if (project.name === 'Slack') {
      console.log('🎨 Slack ProjectCard vote data:', {
        projectId: project.id,
        hasVotes: !!project.votes,
        votesArray: project.votes,
        _count: project._count
      })
    }
    
    if (project.votes && Array.isArray(project.votes)) {
      const upvotes = project.votes.filter((vote: any) => vote.value === 1).length
      const downvotes = project.votes.filter((vote: any) => vote.value === -1).length
      const result = {
        upvotes,
        downvotes,
        totalVotes: upvotes + downvotes, // Show total votes, not net score
        netVotes: upvotes - downvotes // Keep net votes for other calculations
      }
      
      // Debug vote calculation for Slack
      if (project.name === 'Slack') {
        console.log('🎨 Slack vote calculation result:', result)
      }
      
      return result
    } else {
      // Fallback to _count.votes if votes array is not available
      return {
        upvotes: project._count.votes,
        downvotes: 0,
        totalVotes: project._count.votes,
        netVotes: project._count.votes
      }
    }
  }, [project.votes, project._count.votes])

  // Parse tags string to array
  const tagsArray = Array.isArray(project.tags) 
    ? project.tags 
    : (project.tags ? project.tags.split(',').map((tag: string) => tag.trim()) : [])

  // Calculate product points (StartUpPush)
  const productPoints = (voteCounts.upvotes * 10) - (voteCounts.downvotes * 5)

  const handleVote = async (value: number, event?: React.MouseEvent) => {
    console.log('🔥 VOTE BUTTON CLICKED!', { productId: project.id, value, currentUserVote })
    
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    // Prevent spam clicking - minimum 1 second between votes
    const now = Date.now()
    if (now - lastVoteTime < 1000) {
      console.log('Vote too soon, ignoring')
      return
    }

    if (isVoting) {
      console.log('Already voting, ignoring')
      return
    }

    setLastVoteTime(now)
    setIsVoting(true)

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: project.id,
          value: value,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state with the actual vote value from API
        setCurrentUserVote(data.userVote)

        // Call parent callback if provided
        if (onVote) {
          onVote(project.id, value)
        }

        // Add a small delay to ensure database update is complete
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Refresh session to update user points in header
        await update()
        
        // Force another refresh to ensure points are updated
        setTimeout(async () => {
          await update()
        }, 300)
      } else {
        const errorData = await response.json()
        console.error('Vote failed:', errorData)
        if (errorData.error && errorData.error.includes('need at least 1 StartUpPush point')) {
          setAlertMessage('You need at least 1 StartUpPush point to downvote!')
          setShowAlert(true)
        } else if (errorData.error && errorData.error.includes('already voted')) {
          setAlertMessage('You have already voted on this product. Votes are permanent and cannot be changed.')
          setShowAlert(true)
        }
        return
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Insufficient Points"
        message={alertMessage}
      />
      <div className="product-card group">
        <div className="flex items-start space-x-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {project.logo ? (
              <Image
                src={project.logo}
                alt={project.name}
                width={48}
                height={48}
                className="rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground font-semibold text-lg">
                  {project.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Link href={`/p/${project.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {project.name}
                    </h3>
                  </Link>
                  {boostStatus && (
                    <BoostCounter
                      endDate={boostStatus.endDate}
                      className="ml-2"
                    />
                  )}
                  {project.isPromoted && showPromoted && !boostStatus && (
                    <span className="promoted-badge">Promoted</span>
                  )}
                  {project.mrr && (
                    <span className="mrr-badge">
                      ${formatNumber(project.mrr)} MRR
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {project.tagline}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {tagsArray.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {tagsArray.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      +{tagsArray.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  {/* Vote Section */}
                  <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-2">
                                         <Button
                       variant="ghost"
                       size="sm"
                       className={cn(
                         "vote-button hover:bg-green-100 dark:hover:bg-green-900/20",
                         currentUserVote === 1 && "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                         currentUserVote !== null && "opacity-50 cursor-not-allowed"
                       )}
                       onClick={(e) => handleVote(1, e)}
                       disabled={isVoting || currentUserVote !== null}
                     >
                       <ThumbsUp className="h-4 w-4" />
                     </Button>
                    
                    <span className="text-sm font-bold min-w-[2rem] text-center">
                      {formatNumber(voteCounts.totalVotes)}
                    </span>
                    
                                         <Button
                       variant="ghost"
                       size="sm"
                       className={cn(
                         "vote-button hover:bg-red-100 dark:hover:bg-red-900/20",
                         currentUserVote === -1 && "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
                         currentUserVote !== null && "opacity-50 cursor-not-allowed"
                       )}
                       onClick={(e) => handleVote(-1, e)}
                       disabled={isVoting || currentUserVote !== null}
                     >
                       <ThumbsDown className="h-4 w-4" />
                     </Button>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                        <span>🔥</span>
                        <span>{formatNumber(productPoints)}</span>
                        <span className="text-xs">StartUpPush</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {project._count.comments} comments
                      </span>
                      
                      <BoostButton
                        projectId={project.id}
                        projectOwnerId={project.userId}
                        className="text-xs"
                      />
                      
                      <Link href={`/p/${project.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          Visit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
