"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  buttonText?: string
}

export function ErrorModal({ 
  isOpen, 
  onClose, 
  title = "Error", 
  message, 
  buttonText = "OK" 
}: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="default">
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
