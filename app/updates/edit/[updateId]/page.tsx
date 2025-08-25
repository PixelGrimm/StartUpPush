"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface Update {
  id: string
  title: string
  content: string
  productId: string
  product: {
    name: string
    logo: string | null
  }
  user: {
    name: string
    username: string
    image: string | null
  }
}

export default function EditUpdatePage({ params }: { params: { updateId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [update, setUpdate] = useState<Update | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUpdate()
  }, [session, status, router, params.updateId])

  const fetchUpdate = async () => {
    try {
      const response = await fetch(`/api/updates/edit/${params.updateId}`)
      if (response.ok) {
        const data = await response.json()
        setUpdate(data.update)
        setTitle(data.update.title)
        setContent(data.update.content)
      } else {
        router.push('/updates')
      }
    } catch (error) {
      console.error('Error fetching update:', error)
      router.push('/updates')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim() || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/updates/edit/${params.updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setShowSuccessModal(true)
      } else {
        const errorData = await response.json()
        console.error('Error updating update:', errorData)
        setErrorMessage(errorData.error || 'Failed to update. Please try again.')
        setShowErrorModal(true)
      }
    } catch (error) {
      console.error('Error updating update:', error)
      setErrorMessage('Failed to update. Please try again.')
      setShowErrorModal(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!update) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Update not found</h1>
            <Button asChild>
              <a href="/updates">Back to Updates</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/updates">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Updates
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Update</h1>
              <p className="text-muted-foreground">Update your project announcement</p>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={update.product.logo || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=48&h=48&fit=crop'}
              alt={update.product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="font-semibold text-foreground">{update.product.name}</h2>
              <p className="text-sm text-muted-foreground">Update by {update.user.name || update.user.username}</p>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Update Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's new in this update?"
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Update Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share the details of your update..."
              rows={8}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button variant="outline" asChild>
              <a href="/updates">Cancel</a>
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim() || submitting}>
              <Save className="h-4 w-4 mr-2" />
              {submitting ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">
                🎉 Update Updated!
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
                  Your update has been updated successfully!
                </p>
                <p className="text-muted-foreground">
                  Your community will see the updated information.
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/updates')
                }} 
                className="w-full"
              >
                View Updates
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold flex items-center justify-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Error</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="text-center space-y-6">
              <p className="text-muted-foreground">
                {errorMessage}
              </p>

              <Button 
                onClick={() => setShowErrorModal(false)} 
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
