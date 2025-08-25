"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

export function AlertModal({ isOpen, onClose, title, message }: AlertModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        
        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}
