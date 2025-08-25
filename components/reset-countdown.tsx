"use client"

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface ResetCountdownProps {
  className?: string
}

export function ResetCountdown({ className = "" }: ResetCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      
      // Get current UK time
      const ukNow = new Date(now.toLocaleString("en-US", {timeZone: "Europe/London"}))
      
      // Calculate next reset date (1st of next month at 00:00:01 UK time)
      const nextMonth = new Date(ukNow.getFullYear(), ukNow.getMonth() + 1, 1, 0, 0, 1)
      
      // If we're already past the 1st of this month, calculate for next month
      if (ukNow.getDate() >= 1) {
        nextMonth.setMonth(nextMonth.getMonth())
      }
      
      const difference = nextMonth.getTime() - ukNow.getTime()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}>
      <Clock className="h-4 w-4" />
      <span>Next reset in:</span>
      <div className="flex items-center space-x-1 font-mono">
        <span className="bg-muted px-2 py-1 rounded">
          {formatNumber(timeLeft.days)}d
        </span>
        <span>:</span>
        <span className="bg-muted px-2 py-1 rounded">
          {formatNumber(timeLeft.hours)}h
        </span>
        <span>:</span>
        <span className="bg-muted px-2 py-1 rounded">
          {formatNumber(timeLeft.minutes)}m
        </span>
        <span>:</span>
        <span className="bg-muted px-2 py-1 rounded">
          {formatNumber(timeLeft.seconds)}s
        </span>
      </div>
      <span className="text-xs">(UK time)</span>
    </div>
  )
}
