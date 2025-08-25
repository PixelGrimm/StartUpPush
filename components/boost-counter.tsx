"use client"

import { useState, useEffect } from 'react'
import { Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BoostCounterProps {
  endDate: string
  className?: string
}

export function BoostCounter({ endDate, className }: BoostCounterProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now()
      const end = new Date(endDate).getTime()
      const remaining = Math.max(0, end - now)
      
      setTimeRemaining(remaining)
      setIsExpired(remaining === 0)
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [endDate])

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

  if (isExpired) {
    return null
  }

  return (
    <div className={cn("flex items-center space-x-1 text-xs", className)}>
      <Zap className="h-3 w-3 text-orange-500" />
      <span className="text-orange-600 dark:text-orange-400 font-medium">
        Boosted
      </span>
      <Clock className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground">
        {formatTimeRemaining(timeRemaining)}
      </span>
    </div>
  )
}
