"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Clock, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ErrorModal } from '@/components/ui/error-modal'

interface BoostButtonProps {
  projectId: string
  projectOwnerId: string
  className?: string
}

interface BoostStatus {
  boost: {
    id: string
    startDate: string
    endDate: string
    isActive: boolean
    timeRemaining: number
  } | null
  userPoints: number
  canBoost: boolean
}

export function BoostButton({ projectId, projectOwnerId, className }: BoostButtonProps) {
  const { data: session } = useSession()
  const [boostStatus, setBoostStatus] = useState<BoostStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: ''
  })

  const isOwner = session?.user?.id === projectOwnerId

  useEffect(() => {
    if (isOwner) {
      fetchBoostStatus()
    }
  }, [isOwner, projectId])

  useEffect(() => {
    if (boostStatus?.boost?.timeRemaining && boostStatus.boost.timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1000)
          if (newTime === 0) {
            fetchBoostStatus() // Refresh status when boost expires
          }
          return newTime
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [boostStatus?.boost?.timeRemaining])

  const fetchBoostStatus = async () => {
    try {
      const response = await fetch(`/api/boost?projectId=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setBoostStatus(data)
        if (data.boost?.timeRemaining) {
          setTimeRemaining(data.boost.timeRemaining)
        }
      }
    } catch (error) {
      console.error('Error fetching boost status:', error)
    }
  }

  const handleBoost = async () => {
    if (!boostStatus?.canBoost) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/boost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh boost status
        await fetchBoostStatus()
      } else {
        const error = await response.json()
        setErrorModal({
          isOpen: true,
          message: error.error || 'Failed to boost project'
        })
      }
    } catch (error) {
      console.error('Error boosting project:', error)
      setErrorModal({
        isOpen: true,
        message: 'Failed to boost project'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  if (!isOwner) {
    return null
  }

  if (!boostStatus) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={className}
      >
        <Zap className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (boostStatus.boost) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Boosted
        </Button>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {formatTimeRemaining(timeRemaining)}
        </div>
      </div>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBoost}
        disabled={!boostStatus.canBoost || isLoading}
        className={`${boostStatus.canBoost ? 'hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700' : ''} ${className}`}
      >
        <Zap className="h-4 w-4 mr-2" />
        {isLoading ? 'Boosting...' : `Boost (${boostStatus.userPoints} pts)`}
      </Button>

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title="Boost Error"
        message={errorModal.message}
      />
    </>
  )
}
