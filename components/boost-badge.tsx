"use client"

import { useState, useEffect } from "react"

interface BoostBadgeProps {
  planType: 'boosted' | 'max-boosted'
  endDate: string
  className?: string
}

export function BoostBadge({ planType, endDate, className = "" }: BoostBadgeProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const end = new Date(endDate)
      const diff = end.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining('Expired')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0 || (days === 0 && hours >= 12)) {
        // Show days if more than 12 hours remain in the day
        const totalDays = days + (hours >= 12 ? 1 : 0)
        setTimeRemaining(`${totalDays}d`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h`)
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeRemaining(`${minutes}m`)
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [endDate])

  const planName = planType === 'boosted' ? 'Boosted' : 'Max-Boosted'
  const planColor = planType === 'boosted' 
    ? 'bg-black text-white' 
    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${planColor} ${className}`}>
      <span className="text-lg">🔥</span>
      <span>{planName}</span>
      <span className="text-sm opacity-80">• {timeRemaining}</span>
    </div>
  )
}
