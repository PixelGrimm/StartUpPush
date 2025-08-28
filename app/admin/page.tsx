"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  MessageSquare, 
  Rocket, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
  Trash2,
  Search,
  RefreshCw
} from 'lucide-react'

interface AdminStats {
  totalProjects: number
  totalComments: number
  totalUsers: number
  totalBoosts: number
  freeBoosts: number
  paidBoosts: number
  totalRevenue: number
  dailyVisitors: number
  weeklyVisitors: number
  monthlyVisitors: number
}

interface Project {
  id: string
  name: string
  tagline: string
  category: string
  createdAt: string
  status: 'active' | 'jailed' | 'pending'
  user: {
    name: string
    email: string
  }
  _count: {
    votes: number
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  status: 'active' | 'jailed' | 'pending'
  user: {
    name: string
    email: string
  }
  product: {
    name: string
  }
}

interface BoostSale {
  id: string
  type: 'free' | 'boosted' | 'max-boosted'
  amount: number
  createdAt: string
  product: {
    name: string
  }
  user: {
    name: string
    email: string
  }
}

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [boostSales, setBoostSales] = useState<BoostSale[]>([])
  const [jailedProjects, setJailedProjects] = useState<Project[]>([])
  const [jailedComments, setJailedComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('projects')

  // Check admin authentication
  useEffect(() => {
    if (session?.user?.email === 'alexszabo89@icloud.com') {
      setIsAuthenticated(true)
      fetchAdminData()
    } else if (session?.user?.email) {
      // User is logged in but not admin - redirect to home
      router.push('/')
    }
  }, [session, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    // Redirect to NextAuth login instead of client-side auth
    window.location.href = '/auth/signin?callbackUrl=/admin'
  }

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        credentials: 'include'
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch projects
      const projectsResponse = await fetch('/api/admin/projects', {
        credentials: 'include'
      })
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects)
        setJailedProjects(projectsData.projects.filter((p: Project) => p.status === 'jailed'))
      }

      // Fetch comments
      const commentsResponse = await fetch('/api/admin/comments', {
        credentials: 'include'
      })
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        console.log('Admin page: Comments data received:', commentsData)
        setComments(commentsData.comments)
        setJailedComments(commentsData.comments.filter((c: Comment) => c.status === 'jailed'))
      } else {
        console.error('Admin page: Comments API failed:', commentsResponse.status)
      }

      // Fetch boost sales
      const boostResponse = await fetch('/api/admin/boost-sales', {
        credentials: 'include'
      })
      if (boostResponse.ok) {
        const boostData = await boostResponse.json()
        setBoostSales(boostData.sales)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectAction = async (projectId: string, action: 'approve' | 'jail' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        fetchAdminData() // Refresh data - this will preserve the active tab
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleCommentAction = async (commentId: string, action: 'approve' | 'jail' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        fetchAdminData() // Refresh data - this will preserve the active tab
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleCleanupComments = async () => {
    try {
      const response = await fetch('/api/admin/cleanup-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully deleted ${result.deleted} test comments!`)
        // Refresh data - this will preserve the active tab
        fetchAdminData()
      } else {
        alert('Failed to cleanup comments')
      }
    } catch (error) {
      console.error('Error cleaning up comments:', error)
      alert('Error cleaning up comments')
    }
  }

  const handleDateRangeChange = () => {
    fetchAdminData()
  }

  // Filter functions
  const filteredProjects = projects.filter(project => 
    searchQuery === '' || 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredComments = comments.filter(comment => 
    searchQuery === '' || 
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredBoostSales = boostSales.filter(sale => 
    searchQuery === '' || 
    sale.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                You need to be logged in as an admin to access this page.
              </p>
              <Button onClick={handleLogin} className="w-full">
                Login as Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage projects, comments, and boost sales</p>
          </div>
          <Button 
            onClick={fetchAdminData} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date Range Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              <Button onClick={handleDateRangeChange}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalComments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Boosts</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBoosts}</div>
                <p className="text-xs text-muted-foreground">
                  Free: {stats.freeBoosts} | Paid: {stats.paidBoosts}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Visitors</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.dailyVisitors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Visitors</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.weeklyVisitors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Visitors</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyVisitors}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="boost-sales">Boost Sales</TabsTrigger>
            <TabsTrigger value="jail">Jail</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.tagline}</p>
                        <p className="text-xs text-muted-foreground">
                          By {project.user.name} • {project.category} • {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Votes: {project._count.votes} • Comments: {project._count.comments}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {project.status === 'jailed' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleProjectAction(project.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {project.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleProjectAction(project.id, 'jail')}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Jail
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleProjectAction(project.id, 'delete')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Comments</CardTitle>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleCleanupComments}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cleanup Test Comments
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          By {comment.user.name} • On {comment.product.name} • {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {comment.status === 'jailed' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleCommentAction(comment.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {comment.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCommentAction(comment.id, 'jail')}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Jail
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCommentAction(comment.id, 'delete')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Boost Sales Tab */}
          <TabsContent value="boost-sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Boost Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {boostSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{sale.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {sale.type} • Amount: ${sale.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          By {sale.user.name} • {new Date(sale.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jail Tab */}
          <TabsContent value="jail" className="space-y-6">
            {/* Jailed Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Jailed Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jailedProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{project.tagline}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          By {project.user.name} • {project.category} • {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleProjectAction(project.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Release
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleProjectAction(project.id, 'delete')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Jailed Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Jailed Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jailedComments.map((comment) => (
                    <div key={comment.id} className="flex items-start justify-between p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-gray-100">{comment.content}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          By {comment.user.name} • On {comment.product.name} • {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleCommentAction(comment.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Release
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCommentAction(comment.id, 'delete')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
