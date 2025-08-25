"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, User, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import { useState } from 'react'

// Dummy blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Product Development',
    excerpt: 'How artificial intelligence is revolutionizing the way we build and launch products in 2024.',
    content: 'Full article content here...',
    author: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop',
    publishedDate: '2024-01-15',
    readTime: '5 min read',
    category: 'AI & Technology',
    featured: true,
    slug: 'future-of-ai-product-development',
    tags: ['AI', 'Product Development', 'Technology'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Building a Successful SaaS: Lessons from Indie Hackers',
    excerpt: 'Key insights and strategies from successful indie hackers who built profitable SaaS businesses.',
    content: 'Full article content here...',
    author: 'Marcus Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop',
    publishedDate: '2024-01-12',
    readTime: '8 min read',
    category: 'Business',
    featured: false,
    slug: 'building-successful-saas-indie-hackers',
    tags: ['SaaS', 'Indie Hacking', 'Business'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'No-Code Tools That Are Changing the Game',
    excerpt: 'Discover the best no-code platforms that are empowering creators to build without coding.',
    content: 'Full article content here...',
    author: 'Alex Thompson',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop',
    publishedDate: '2024-01-10',
    readTime: '6 min read',
    category: 'No-Code',
    featured: false,
    slug: 'no-code-tools-changing-game',
    tags: ['No-Code', 'Tools', 'Productivity'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'The Rise of Community-Driven Product Discovery',
    excerpt: 'How platforms like StartUpPush are changing how we discover and validate new products.',
    content: 'Full article content here...',
    author: 'Priya Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop',
    publishedDate: '2024-01-08',
    readTime: '4 min read',
    category: 'Community',
    featured: false,
    slug: 'rise-community-driven-product-discovery',
    tags: ['Community', 'Product Discovery', 'Platforms'],
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop'
  },
  {
    id: 5,
    title: 'Design Trends That Will Dominate 2024',
    excerpt: 'From AI-generated designs to sustainable UX, here are the trends shaping digital design this year.',
    content: 'Full article content here...',
    author: 'David Kim',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop',
    publishedDate: '2024-01-05',
    readTime: '7 min read',
    category: 'Design',
    featured: false,
    slug: 'design-trends-2024',
    tags: ['Design', 'UX', 'Trends'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=400&fit=crop'
  },
  {
    id: 6,
    title: 'Monetization Strategies for Digital Products',
    excerpt: 'Effective ways to monetize your digital products and maximize revenue in today\'s competitive market.',
    content: 'Full article content here...',
    author: 'Emma Wilson',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop',
    publishedDate: '2024-01-03',
    readTime: '9 min read',
    category: 'Business',
    featured: false,
    slug: 'monetization-strategies-digital-products',
    tags: ['Monetization', 'Business', 'Revenue'],
    image: 'https://images.unsplash.com/photo-1686191128892-3e87d4d6e8c1?w=800&h=400&fit=crop'
  }
]

const categories = ['All', 'AI & Technology', 'Business', 'No-Code', 'Community', 'Design']

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            StartUpPush Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, tips, and stories from the startup community. Learn from founders, 
            discover trends, and stay ahead of the curve.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 text-primary mr-2" />
              Featured Article
            </h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="text-muted-foreground text-sm">{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={featuredPost.authorAvatar}
                        alt={featuredPost.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{featuredPost.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(featuredPost.publishedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-muted text-foreground px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-foreground">{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
