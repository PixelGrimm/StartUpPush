"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, Package, Star, TrendingUp } from 'lucide-react'
import { BoostBadge } from '@/components/boost-badge'
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal'

interface UserStats {
  points: number
  productsCount: number
  totalVotes: number
  products: Array<{
    id: string
    name: string
    tagline: string
    website: string
    isPromoted: boolean
    mrr: number | null
    logo: string | null
    screenshots: string | null
    _count: {
      votes: number
    }
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [boostStatuses, setBoostStatuses] = useState<Record<string, { type: 'boosted' | 'max-boosted', endDate: string } | null>>({})
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    productId: string | null
    productName: string | null
  }>({
    isOpen: false,
    productId: null,
    productName: null
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUserStats()
  }, [session, status, router])

  const fetchBoostStatuses = async (products: any[]) => {
    const statuses: Record<string, { type: 'boosted' | 'max-boosted', endDate: string } | null> = {}
    
    for (const product of products) {
      try {
        const response = await fetch(`/api/promotions?productId=${product.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.promotion) {
            statuses[product.id] = {
              type: data.promotion.type as 'boosted' | 'max-boosted',
              endDate: data.promotion.endDate
            }
          } else {
            statuses[product.id] = null
          }
        }
      } catch (error) {
        console.error('Error fetching boost status for product:', product.id, error)
        statuses[product.id] = null
      }
    }
    
    setBoostStatuses(statuses)
  }

  const fetchUserStats = async () => {
    try {
      console.log('Fetching user stats...')
      const response = await fetch('/api/user/stats')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('User stats data:', data)
        setStats(data)
        // Fetch boost statuses for all products
        if (data.products && data.products.length > 0) {
          fetchBoostStatuses(data.products)
        }
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!deleteModal.productId) return
    
    try {
      const response = await fetch(`/api/products/${deleteModal.productId}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        // Refresh the page to update the stats
        window.location.reload()
      } else {
        console.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const openDeleteModal = (productId: string, productName: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: null,
      productName: null
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Points
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.points}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Projects
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.productsCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Votes
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalVotes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="/submit">Submit New Project</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/explore">Explore Projects</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/profile">Edit Profile</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/updates">Project Updates</a>
              </Button>
            </div>
          </div>

          {/* User Products */}
          {stats && stats.products && stats.products.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Your Projects
              </h2>
              <div className="space-y-4">
                {stats.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    {/* Left side - Logo, Name, Tagline, Date, MRR */}
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Logo */}
                      {product.logo ? (
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={product.logo}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-muted-foreground">
                            {product.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.tagline}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Published
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.mrr ? `$${product.mrr.toLocaleString()} MRR` : '- MRR'}
                          </span>

                          {boostStatuses[product.id] && (
                            <BoostBadge
                              planType={boostStatuses[product.id]!.type}
                              endDate={boostStatuses[product.id]!.endDate}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        asChild
                      >
                        <a href={`/p/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                          <span className="mr-1">👁️</span>
                          Visit Project
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-black text-white hover:bg-gray-800"
                        asChild
                      >
                        <a href={`/boost/${product.id}`}>
                          <span className="mr-1">🔥</span>
                          Boost Visibility
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/products/${product.id}/edit`}>
                          ✏️
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDeleteModal(product.id, product.name)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats && stats.products.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No projects yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by submitting your first project to get discovered by the community.
              </p>
              <Button asChild>
                <a href="/submit">Submit Your First Project</a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        description="Are you sure you want to delete"
        productName={deleteModal.productName || undefined}
      />
    </div>
  )
}
