"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Calendar, User } from 'lucide-react'

interface ProjectUpdate {
  id: string
  title: string
  content: string
  projectId: string
  projectName: string
  createdAt: string
  user: {
    name: string
    username: string
    image: string | null
  }
}

interface Project {
  id: string
  name: string
  tagline: string
  logo: string | null
}

export default function ProjectUpdatesPage({ params }: { params: { projectId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchProjectAndUpdates()
  }, [session, status, router, params.projectId])

  const fetchProjectAndUpdates = async () => {
    try {
      // Fetch project details
      const projectResponse = await fetch(`/api/products/${params.projectId}`)
      if (projectResponse.ok) {
        const projectData = await projectResponse.json()
        setProject(projectData)
      }

      // Fetch updates for this project
      const updatesResponse = await fetch(`/api/updates?projectId=${params.projectId}`)
      if (updatesResponse.ok) {
        const updatesData = await updatesResponse.json()
        setUpdates(updatesData.updates || [])
      }
    } catch (error) {
      console.error('Error fetching project and updates:', error)
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

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Project not found</h1>
            <Button asChild>
              <a href="/dashboard">Back to Dashboard</a>
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
              <a href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </a>
            </Button>
            <div className="flex items-center space-x-3">
              {project.logo && (
                <img
                  src={project.logo}
                  alt={project.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground">{project.name} Updates</h1>
                <p className="text-muted-foreground">{project.tagline}</p>
              </div>
            </div>
          </div>
          <Button asChild>
            <a href={`/updates/new?projectId=${params.projectId}`}>
              <Plus className="h-4 w-4 mr-2" />
              Create Update
            </a>
          </Button>
        </div>

        {/* Updates List */}
        {updates.length > 0 ? (
          <div className="space-y-6">
            {updates.map((update) => (
              <div key={update.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={update.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                      alt={update.user?.name || 'Anonymous'}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{update.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {update.user?.name || update.user?.username || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-foreground">
                  <p>{update.content}</p>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/p/${update.projectId}`}>View Project</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/updates/${update.id}/edit`}>Edit Update</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-foreground mb-2">No updates yet for {project.name}</h3>
              <p className="text-muted-foreground mb-6">
                Start sharing updates about this project to keep your community informed.
              </p>
              <Button asChild>
                <a href={`/updates/new?projectId=${params.projectId}`}>Create Your First Update</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
