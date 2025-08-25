"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Calendar, User, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  name: string
  tagline: string
  logo: string | null
  createdAt: string
  _count: {
    votes: number
    comments: number
  }
}

export default function NewUpdatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
    
    if (status === 'loading') return

    if (session) {
      console.log('Session found, fetching projects')
      fetchUserProjects()
    }
  }, [session, status, router])

  const fetchUserProjects = async () => {
    try {
      console.log('Fetching user projects...')
      const response = await fetch('/api/user/stats')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('User stats data:', data)
        setProjects(data.products || [])
      } else {
        const errorData = await response.json()
        console.error('API error:', errorData)
      }
    } catch (error) {
      console.error('Error fetching user projects:', error)
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
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

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/updates">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Updates
                </a>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Update</h1>
                <p className="text-muted-foreground">Select a project to create an update for</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-foreground mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to create project updates. Please sign in to continue.
              </p>
              <Button asChild>
                <a href="/auth/signin">Sign In</a>
              </Button>
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
              <a href="/updates">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Updates
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Update</h1>
              <p className="text-muted-foreground">Select a project to create an update for</p>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={project.logo || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=48&h=48&fit=crop'}
                      alt={project.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.tagline}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>🔥 {project._count.votes} votes</span>
                    <span>💬 {project._count.comments} comments</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown date'}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button className="flex-1" asChild>
                    <a href={`/updates/${project.id}/new`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Update
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/p/${project.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                You need to create a project first before you can share updates.
              </p>
              <Button asChild>
                <a href="/submit">Create Your First Project</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
