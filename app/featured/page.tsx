"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { ProjectCard } from '@/components/project-card'

interface Product {
  id: string
  name: string
  tagline: string
  description: string
  website: string
  logo?: string | null
  category: string
  tags: string[]
  mrr?: number | null
  isPromoted: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  _count: {
    votes: number
    comments: number
  }
  votes: Array<{
    userId: string
    value: number
  }>
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
}

interface FeaturedCriteria {
  minUpvotes: number
  minUpvoteRatio: number
  minComments: number
  minDaysSinceLaunch: number
}

export default function FeaturedPage() {
  const { data: session } = useSession()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [userVotes, setUserVotes] = useState<Record<string, number>>({})

  // Featured criteria - products must meet these requirements
  const featuredCriteria: FeaturedCriteria = {
    minUpvotes: 50,        // Minimum 50 upvotes
    minUpvoteRatio: 100,   // 100% upvote ratio (no downvotes)
    minComments: 10,       // Minimum 10 comments
    minDaysSinceLaunch: 7  // At least 7 days since launch
  }

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?featured=true')
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.products || [])
        
        // Get user votes for these products
        if (session?.user) {
          const votesResponse = await fetch('/api/user/votes')
          if (votesResponse.ok) {
            const votesData = await votesResponse.json()
            const votesMap: Record<string, number> = {}
            votesData.votes.forEach((vote: any) => {
              votesMap[vote.productId] = vote.value
            })
            setUserVotes(votesMap)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (productId: string, value: number) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, value }),
      })

      if (response.ok) {
        // Update local state
        setUserVotes(prev => ({
          ...prev,
          [productId]: value
        }))
        
        // Refresh the products to get updated vote counts
        fetchFeaturedProducts()
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const calculateUpvoteRatio = (votes: Array<{ value: number }>) => {
    if (votes.length === 0) return 0
    const upvotes = votes.filter(v => v.value === 1).length
    return Math.round((upvotes / votes.length) * 100)
  }

  const calculateComments = (product: Product) => {
    return product._count.comments || 0
  }

  const getDaysSinceLaunch = (createdAt: string) => {
    const launchDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - launchDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  🏆 Featured Products
                </h1>
                <p className="text-muted-foreground mt-2">
                  Curated products that meet our high standards for quality and engagement
                </p>
              </div>
            </div>
          </div>

          {/* Featured Criteria Info */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Featured Criteria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{featuredCriteria.minUpvotes}+ Upvotes</p>
                  <p className="text-sm text-muted-foreground">Minimum votes required</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{featuredCriteria.minUpvoteRatio}% Upvote Ratio</p>
                  <p className="text-sm text-muted-foreground">Perfect score required</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                                 <div>
                   <p className="font-semibold text-foreground">{featuredCriteria.minComments}+ Comments</p>
                   <p className="text-sm text-muted-foreground">Minimum comments required</p>
                 </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{featuredCriteria.minDaysSinceLaunch}+ Days Old</p>
                  <p className="text-sm text-muted-foreground">Minimum age required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Featured Products ({featuredProducts.length})
              </h2>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Featured Products Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Products need to meet our strict criteria to be featured. Keep building and engaging!
                </p>
                <Button asChild>
                  <Link href="/explore">Explore All Products</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {featuredProducts.map((product) => {
                                     const upvoteRatio = calculateUpvoteRatio(product.votes)
                   const comments = calculateComments(product)
                   const daysSinceLaunch = getDaysSinceLaunch(product.createdAt)
                  
                  return (
                    <div key={product.id} className="bg-card border border-border rounded-lg p-6">
                      <ProjectCard
                        project={product}
                        userVote={userVotes[product.id]}
                        onVote={handleVote}
                        showPromoted={false}
                      />
                      
                      {/* Featured Stats */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="text-foreground">{product._count.votes} votes</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Zap className="h-4 w-4 text-green-500" />
                              <span className="text-foreground">{upvoteRatio}% upvote ratio</span>
                            </span>
                                                         <span className="flex items-center space-x-1">
                               <Users className="h-4 w-4 text-purple-500" />
                               <span className="text-foreground">{comments} comments</span>
                             </span>
                            <span className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-orange-500" />
                              <span className="text-foreground">{daysSinceLaunch} days old</span>
                            </span>
                          </div>
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            🏆 Featured
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
