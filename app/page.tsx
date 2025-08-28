"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SimpleProductCard } from '@/components/simple-product-card'
import { Rocket, Search, CheckCircle, TrendingUp, Calendar, ChevronDown, Bell, Zap } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface Product {
  id: string
  name: string
  tagline: string
  description: string
  logo?: string
  website: string
  category: string
  tags: string[] | string
  mrr?: number
  isPromoted: boolean
  createdAt: string
  userId: string
  points: number
  totalVoteCount?: number
  userVote?: number | null
  user?: {
    id: string
    name: string
    username?: string
    points: number
  }
  _count: {
    votes: number
    comments: number
  }
  votes: Array<{
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

// Empty arrays for when no products exist
const sampleProducts: Product[] = []
const promotedProducts: Product[] = []

const featuredProducts: Array<{
  name: string
  description: string
  image: string
  badge: string
  url: string
}> = []

export default function HomePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('top')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        // Combine all product sections into one array
        const allProducts = [
          ...(data.todaysTop || []),
          ...(data.yesterdaysTop || []),
          ...(data.weeklyTop || []),
          ...(data.monthlyTop || []),
          ...(data.todaysPromoted || []),
          ...(data.yesterdaysPromoted || []),
          ...(data.weeklyPromoted || []),
          ...(data.monthlyPromoted || [])
        ]
        setProducts(allProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (products.length > 0) {
      // Use real API data
      switch (activeTab) {
        case 'top':
          return products.slice(0, 4) // Top 4 products
        case 'new':
          return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4)
        case 'recently updated':
          return products.slice(0, 4) // For now, same as top
        default:
          return products.slice(0, 4)
      }
    } else {
      // Use sample data
      switch (activeTab) {
        case 'top':
          return sampleProducts
        case 'new':
          return [...sampleProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        case 'recently updated':
          return sampleProducts.slice().reverse() // Reverse order for variety
        default:
          return sampleProducts
      }
    }
  }

  const displayProducts = getFilteredProducts()
  const displayPromotedProducts = products.filter(p => p.isPromoted)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-screen relative -mx-6 -mt-6 bg-black">
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Turn your product into a{' '}
              <span className="text-purple-400">success story</span>.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              More than just a{' '}
              <span className="text-purple-600">launchpad</span>—StartUpPush is a community of{' '}
              <span className="text-blue-400">makers and innovators</span>. Discover, upvote, and support fresh ideas, while earning StartUpPush Points to boost the visibility of your own product.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-4 text-lg border border-gray-700" asChild>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex space-x-1 mb-8">
              {['top', 'new', 'recently updated'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-black text-white border border-blue-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Products Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {activeTab === 'top' && `Today Top ${displayProducts.length} Project`}
                {activeTab === 'new' && `Latest ${displayProducts.length} Project`}
                {activeTab === 'recently updated' && `Recently Updated ${displayProducts.length} Project`}
              </h2>
              
                                           {displayProducts.length > 0 ? (
                <div className="space-y-4">
                  {displayProducts.map((product) => (
                    <SimpleProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    <Rocket className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-sm">Be the first to submit a project!</p>
                  </div>
                  <Button asChild>
                    <Link href="/submit">
                      <Rocket className="mr-2 h-4 w-4" />
                      Submit Your Project
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Promoted Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                🔥 Promoted
              </h2>
              
                                           {displayPromotedProducts.length > 0 ? (
                <div className="space-y-4">
                  {displayPromotedProducts.map((product) => (
                    <SimpleProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    <h3 className="text-sm font-medium mb-1">No promoted projects</h3>
                    <p className="text-xs">Promoted projects will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0">
            {/* Featured Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🏆 Featured Products
              </h3>
              
              {featuredProducts.length > 0 ? (
                <div className="space-y-4">
                  {featuredProducts.map((product, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 relative">
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                          {product.badge}
                        </div>
                        <div className="text-xs text-gray-500 absolute bottom-1 left-1">
                          {product.url}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    <h3 className="text-sm font-medium mb-1">No featured products</h3>
                    <p className="text-xs">Featured products will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Latest from Blog */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Latest from Blog
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    How to Promote Your Product: 5 Strategies That Actually Drive...
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    Skip the vanity metrics. These 5 proven promotion strategies will turn your...
                  </p>
                  <p className="text-xs text-gray-500">
                    Aug 19 • 5 min read
                  </p>
                </div>
                
                <Link href="/blog" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                  View all posts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
