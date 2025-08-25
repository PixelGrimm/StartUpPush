"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Calendar, User, ExternalLink, MessageCircle } from 'lucide-react'

interface ProjectUpdate {
  id: string
  title: string
  content: string
  productId: string
  createdAt: string
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

export default function UpdatesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUpdates()
  }, [session, status, router])

  const fetchUpdates = async () => {
    try {
      const response = await fetch('/api/updates')
      
      if (response.ok) {
        const data = await response.json()
        setUpdates(data.updates || [])
      } else {
        const errorData = await response.json()
        console.error('API error:', errorData)
      }
    } catch (error) {
      console.error('Error fetching updates:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              ))}
            </div>
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
              <a href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Project Updates</h1>
              <p className="text-muted-foreground">Stay updated with the latest changes from your projects</p>
            </div>
          </div>
          <Button asChild>
            <a href="/updates/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Update
            </a>
          </Button>
        </div>

        {/* Updates List */}
        {updates.length > 0 ? (
          <div className="space-y-6">
            {updates.map((update) => (
              <div key={update.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Header with User Info and Date */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={update.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                      alt={update.user?.name || 'Anonymous'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{update.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {update.user?.name || update.user?.username || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Project Badge */}
                <div className="inline-flex items-center space-x-2 mb-4 px-3 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <img
                    src={update.product.logo || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=20&h=20&fit=crop'}
                    alt={update.product.name}
                    className="w-5 h-5 rounded object-cover"
                  />
                  <span className="text-sm font-medium text-primary">
                    {update.product.name}
                  </span>
                </div>
                
                {/* Update Content */}
                <div className="prose prose-sm max-w-none text-foreground mb-6">
                  <p className="text-base leading-relaxed">{update.content}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/p/${update.product?.name ? update.product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'unknown'}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/updates/edit/${update.id}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Edit Update
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-foreground mb-2">No updates yet</h3>
              <p className="text-muted-foreground mb-6">
                Start sharing updates about your projects to keep your community informed.
              </p>
              <Button asChild>
                <a href="/updates/new">Create Your First Update</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
