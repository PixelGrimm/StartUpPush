"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface BoostSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  planType: 'boosted' | 'max-boosted' | 'points'
  projectName: string
}

export function BoostSuccessModal({ isOpen, onClose, planType, projectName }: BoostSuccessModalProps) {
  const daysRemaining = planType === 'boosted' ? 7 : planType === 'max-boosted' ? 30 : 1
  const planName = planType === 'boosted' ? 'Boosted' : planType === 'max-boosted' ? 'Max-Boosted' : 'Points Boost'
  const planColor = planType === 'boosted' ? 'bg-black' : planType === 'max-boosted' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-blue-600'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            🎉 Boost Successful!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {projectName} is now {planName}!
            </p>
            <p className="text-muted-foreground">
              Your project will be promoted for the next {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}.
            </p>
          </div>

          {/* Boost Badge Preview */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className={`w-8 h-8 ${planColor} rounded-full flex items-center justify-center`}>
                <span className="text-lg">🔥</span>
              </div>
              <span className="font-semibold">{planName}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
            </div>
          </div>

          {/* Action Button */}
          <Button onClick={onClose} className="w-full">
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
