"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Sidebar } from '@/components/sidebar'
import { ProjectRankings } from '@/components/product-rankings'
import { FilterTabs } from '@/components/filter-tabs'
import { Rocket, Search, CheckCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
// Temporarily comment out dialog import to fix voting issue
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'

interface Product {
  id: string
  name: string
  tagline: string
  description: string
  logo?: string | null
  website: string
  category: string
  tags: string[] | string
  mrr?: number | null
  isPromoted: boolean
  createdAt: string
  userId: string
  points: number // StartUpPush points
  totalVoteCount?: number
  userVote?: number | null
  _count: {
    votes: number
    comments?: number
  }
  votes?: Array<{
    value: number
    userId: string
  }>
  promotions?: Array<{
    id: string
    type: string
    startDate: string
    endDate: string
    isActive: boolean
  }>
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  createdAt: Date
}

// Dummy data for testing
const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'NotionAI',
    tagline: 'AI-powered workspace for teams',
    description: 'AI-powered workspace for teams',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop',
    website: 'https://notion.ai',
    category: 'Productivity',
    tags: ['AI Tools', 'Productivity', 'Collaboration'],
    mrr: 50000,
    isPromoted: true,
    createdAt: new Date().toISOString(),
    userId: 'user1',
    points: 2840,
    _count: { votes: 15 },
    votes: Array.from({ length: 15 }, (_, i) => ({ value: 1, userId: `user${i}` }))
  },
  {
    id: '2',
    name: 'Stripe',
    tagline: 'Payment processing for the internet',
    description: 'Payment processing for the internet',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=64&h=64&fit=crop',
    website: 'https://stripe.com',
    category: 'Fintech',
    tags: ['Fintech', 'Payments', 'API'],
    mrr: 1000000,
    isPromoted: true,
    createdAt: new Date().toISOString(),
    userId: 'user2',
    points: 3420,
    _count: { votes: 25 },
    votes: Array.from({ length: 25 }, (_, i) => ({ value: 1, userId: `user${i}` }))
  },
  {
    id: '3',
    name: 'Vercel',
    tagline: 'Deploy frontend developers',
    description: 'Deploy frontend developers',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=64&h=64&fit=crop',
    website: 'https://vercel.com',
    category: 'Developer Tools',
    tags: ['Developer Tools', 'Hosting', 'Deployment'],
    mrr: 200000,
    isPromoted: false,
    createdAt: new Date().toISOString(),
    userId: 'user3',
    points: 1567,
    _count: { votes: 12 },
    votes: Array.from({ length: 12 }, (_, i) => ({ value: 1, userId: `user${i}` }))
  },
  {
    id: '4',
    name: 'Linear',
    tagline: 'Issue tracking built for high-performance teams',
    description: 'Issue tracking built for high-performance teams',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop',
    website: 'https://linear.app',
    category: 'Developer Tools',
    tags: ['Developer Tools', 'Project Management', 'Issue Tracking'],
    mrr: 75000,
    isPromoted: false,
    createdAt: new Date(),
    userId: 'user4',
    points: 1234,
    _count: { votes: 8 },
    votes: Array.from({ length: 8 }, (_, i) => ({ value: 1, userId: `user${i}` }))
  },
  {
    id: '5',
    name: 'Figma',
    tagline: 'Collaborative interface design tool',
    description: 'Collaborative interface design tool',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop',
    website: 'https://figma.com',
    category: 'Design',
    tags: ['Design', 'Collaboration', 'UI/UX'],
    mrr: 300000,
    isPromoted: true,
    createdAt: new Date(),
    userId: 'user5',
    points: 1987,
    _count: { votes: 20 },
    votes: Array.from({ length: 20 }, (_, i) => ({ value: 1, userId: `user${i}` }))
  },
  {
    id: '6',
    name: 'Slack',
    tagline: 'Where work happens',
    description: 'Where work happens',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop',
    website: 'https://slack.com',
    category: 'Communication',
    tags: ['Communication', 'Team Chat', 'Collaboration'],
    mrr: 500000,
    isPromoted: false,
    createdAt: new Date(),
    userId: 'user6',
    points: 1678,
    _count: { votes: 10 },
    votes: Array.from({ length: 10 }, (_, i) => ({ value: 1, userId: `user${i}` }))
  }
]

const dummyBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Product Discovery',
    slug: 'future-of-product-discovery',
    excerpt: 'How AI and community-driven platforms are revolutionizing product discovery',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Building a Successful SaaS Product',
    slug: 'building-successful-saas-product',
    excerpt: 'Key strategies for building and growing a successful SaaS business',
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'StartUpPush Points: A New Way to Rank',
    slug: 'startuppush-points-ranking',
    excerpt: 'Understanding how the points system works and how to maximize your ranking',
    createdAt: new Date()
  }
]

export default function HomePage() {
  const { data: session } = useSession()
  const { searchQuery } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('top')
  const [products, setProducts] = useState<{
    todaysTop: Product[]
    todaysPromoted: Product[]
    yesterdaysTop: Product[]
    yesterdaysPromoted: Product[]
    weeklyTop: Product[]
    weeklyPromoted: Product[]
    monthlyTop: Product[]
    monthlyPromoted: Product[]
  }>({
    todaysTop: [dummyProducts[0], dummyProducts[2], dummyProducts[3]],
    todaysPromoted: [dummyProducts[0], dummyProducts[1], dummyProducts[4]],
    yesterdaysTop: [dummyProducts[1], dummyProducts[4], dummyProducts[5]],
    yesterdaysPromoted: [dummyProducts[1], dummyProducts[4]],
    weeklyTop: [dummyProducts[0], dummyProducts[1], dummyProducts[2]],
    weeklyPromoted: [dummyProducts[0], dummyProducts[1], dummyProducts[4]],
    monthlyTop: [dummyProducts[1], dummyProducts[4], dummyProducts[5]],
    monthlyPromoted: [dummyProducts[1], dummyProducts[4]],
  })
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(dummyProducts.slice(0, 3))
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>(dummyBlogPosts)
  const [userVotes, setUserVotes] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Check for welcome parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('welcome') === 'true') {
      // Check if user has already seen the welcome modal
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true)
        // Mark as seen
        localStorage.setItem('hasSeenWelcome', 'true')
      }
      // Remove the parameter from URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts({
          todaysTop: data.todaysTop || [],
          todaysPromoted: data.todaysPromoted || [],
          yesterdaysTop: data.yesterdaysTop || [],
          yesterdaysPromoted: data.yesterdaysPromoted || [],
          weeklyTop: data.weeklyTop || [],
          weeklyPromoted: data.weeklyPromoted || [],
          monthlyTop: data.monthlyTop || [],
          monthlyPromoted: data.monthlyPromoted || [],
        })
        setFeaturedProducts(data.featuredProducts || [])
        setUserVotes(data.userVotes || {})
        
        // Log which products you've voted on vs haven't voted on
        console.log('📊 Products loaded:', {
          totalProducts: (data.todaysTop || []).length + (data.yesterdaysTop || []).length + (data.weeklyTop || []).length + (data.monthlyTop || []).length + (data.todaysPromoted || []).length + (data.yesterdaysPromoted || []).length + (data.weeklyPromoted || []).length + (data.monthlyPromoted || []).length,
          todaysTop: (data.todaysTop || []).length,
          todaysPromoted: (data.todaysPromoted || []).length,
          yesterdaysTop: (data.yesterdaysTop || []).length,
          yesterdaysPromoted: (data.yesterdaysPromoted || []).length,
          weeklyTop: (data.weeklyTop || []).length,
          weeklyPromoted: (data.weeklyPromoted || []).length,
          monthlyTop: (data.monthlyTop || []).length,
          monthlyPromoted: (data.monthlyPromoted || []).length,
          votedProducts: Object.keys(data.userVotes || {}).length,
          userVotes: data.userVotes || {}
        })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Don't fallback to dummy data - just show empty state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products based on search query
  const filterProducts = (productList: Product[]) => {
    if (!searchQuery.trim()) return productList
    
    const query = searchQuery.toLowerCase()
    return productList.filter(product => {
      const tagsArray = Array.isArray(product.tags) 
        ? product.tags 
        : (product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : [])
      
      return product.name.toLowerCase().includes(query) ||
        product.tagline.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        tagsArray.some((tag: string) => tag.toLowerCase().includes(query))
    })
  }

  // Apply search filter to all product lists
  const filteredProducts = {
    todaysTop: filterProducts(products.todaysTop),
    todaysPromoted: filterProducts(products.todaysPromoted),
    yesterdaysTop: filterProducts(products.yesterdaysTop),
    yesterdaysPromoted: filterProducts(products.yesterdaysPromoted),
    weeklyTop: filterProducts(products.weeklyTop),
    weeklyPromoted: filterProducts(products.weeklyPromoted),
    monthlyTop: filterProducts(products.monthlyTop),
    monthlyPromoted: filterProducts(products.monthlyPromoted),
  }

  const handleVote = async (productId: string, value: number) => {
    console.log('Main page handleVote called:', { productId, value, hasSession: !!session?.user })
    
    if (!session?.user) {
      // Redirect to sign in or show modal
      return
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, value }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state with the actual vote value from API
        setUserVotes(prev => ({
          ...prev,
          [productId]: data.userVote,
        }))

        // Refresh products to get updated vote counts
        fetchProducts()
      } else {
        const errorData = await response.json()
        console.error('Vote failed:', errorData)
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  if (loading) {
    return (
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
    )
  }

  return (
    <div className="bg-background">
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Top Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              The community-driven platform for project discovery
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Turn your product into a{' '}
              <span className="text-purple-600">success story</span>.
            </motion.h1>
            
            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              More than just a <span className="text-purple-600">launchpad</span>—StartUpPush is a community of <span className="text-blue-600">makers and innovators</span>. Discover, upvote, and support fresh ideas, while earning <strong>StartUpPush Points</strong> to boost the visibility of your own product.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white" asChild>
                <Link href="/submit">
                  <Rocket className="mr-2 h-5 w-5" />
                  Submit Your Project
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="flex gap-8">
          {/* Product Rankings */}
          <main className="flex-1">
            {/* Filter Tabs */}
            <FilterTabs 
              activeFilter={activeFilter} 
              onFilterChange={setActiveFilter} 
            />
            
            {/* Search Results Indicator */}
            {searchQuery.trim() && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Search results for: <span className="font-medium text-foreground">"{searchQuery}"</span>
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => useAppStore.getState().setSearchQuery('')}
                    className="text-xs"
                  >
                    Clear search
                  </Button>
                </div>
              </div>
            )}
            
            <ProjectRankings
              todaysTop={filteredProducts.todaysTop}
              todaysPromoted={filteredProducts.todaysPromoted}
              yesterdaysTop={filteredProducts.yesterdaysTop}
              yesterdaysPromoted={filteredProducts.yesterdaysPromoted}
              weeklyTop={filteredProducts.weeklyTop}
              weeklyPromoted={filteredProducts.weeklyPromoted}
              monthlyTop={filteredProducts.monthlyTop}
              monthlyPromoted={filteredProducts.monthlyPromoted}
              userVotes={userVotes}
              onVote={handleVote}
            />
          </main>

          {/* Sidebar */}
          <Sidebar
            featuredProducts={featuredProducts}
            latestPosts={latestPosts}
          />
        </div>
      </div>

      {/* Welcome Modal - Temporarily disabled */}
      {/* <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Welcome to StartUpPush! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Your profile setup is complete! You're now ready to discover amazing products, vote, and submit your own projects.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✨ <strong>What you can do now:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Vote on projects to earn StartUpPush points</li>
                <li>Submit your own project for discovery</li>
                <li>Explore different categories and builders</li>
                <li>Connect with the community</li>
              </ul>
            </div>
            <Button 
              onClick={() => setShowWelcomeModal(false)}
              className="w-full"
            >
              Get Started!
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
