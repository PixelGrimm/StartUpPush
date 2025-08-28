"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AlertTriangle, X, CheckCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface JailedContentModalProps {
  isOpen: boolean
  onClose: () => void
  notification?: {
    id: string
    type: string
    title: string
    message: string
    productId?: string
    commentId?: string
  }
}

export function JailedContentModal({ isOpen, onClose, notification }: JailedContentModalProps) {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!notification || !isVisible) return null

  const getModalContent = () => {
    const isProject = notification.type.includes('PROJECT')
    const isJailed = notification.type.includes('JAILED')
    const isDeleted = notification.type.includes('DELETED')
    const isApproved = notification.type.includes('APPROVED')

    return {
      icon: isApproved ? (
        <CheckCircle className="h-12 w-12 text-green-500" />
      ) : isDeleted ? (
        <Trash2 className="h-12 w-12 text-red-500" />
      ) : (
        <AlertTriangle className="h-12 w-12 text-orange-500" />
      ),
      title: notification.title,
      description: notification.message,
      badge: isApproved ? (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Approved
        </Badge>
      ) : isDeleted ? (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Deleted
        </Badge>
      ) : (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          Under Review
        </Badge>
      ),
      buttonText: isApproved ? 'View Project' : 'Understand',
      buttonAction: isApproved && notification.productId ? () => {
        // Navigate to project page
        window.location.href = `/p/${notification.productId}`
      } : undefined
    }
  }

  const content = getModalContent()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {content.icon}
              <span>{content.title}</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {content.badge}
          </div>
        </DialogHeader>
        <DialogDescription className="text-left">
          <p className="text-sm text-muted-foreground mb-4">
            {content.description}
          </p>
          
          {notification.type.includes('JAILED') && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Our moderation team will review your content</li>
                <li>• You'll receive an update within 24-48 hours</li>
                <li>• If approved, your content will be restored</li>
                <li>• If rejected, you can submit new content</li>
              </ul>
            </div>
          )}

          {notification.type.includes('DELETED') && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Content Removed
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Your content has been permanently removed due to violations of our community guidelines. 
                Please review our rules before submitting new content.
              </p>
            </div>
          )}

          {notification.type.includes('APPROVED') && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                Content Approved! 🎉
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your content has been approved and is now live on the platform. 
                Thank you for contributing to our community!
              </p>
            </div>
          )}
        </DialogDescription>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {content.buttonAction && (
            <Button onClick={content.buttonAction}>
              {content.buttonText}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
