"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench, Users, TrendingUp, Star } from 'lucide-react'

// Dummy builders data - in a real app this would come from the database
const builders = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop',
    bio: 'Full-stack developer building AI-powered productivity tools',
    products: 3,
    followers: 1247,
    points: 2840,
    featured: true
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
    bio: 'Designer and entrepreneur focused on no-code solutions',
    products: 2,
    followers: 892,
    points: 1956,
    featured: true
  },
  {
    id: 3,
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop',
    bio: 'Indie hacker building developer tools and APIs',
    products: 4,
    followers: 2156,
    points: 3420,
    featured: false
  },
  {
    id: 4,
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop',
    bio: 'Product manager turned founder, creating fintech solutions',
    products: 1,
    followers: 567,
    points: 1234,
    featured: false
  },
  {
    id: 5,
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop',
    bio: 'UX designer building tools for remote teams',
    products: 2,
    followers: 789,
    points: 1678,
    featured: false
  },
  {
    id: 6,
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop',
    bio: 'Data scientist creating analytics and monitoring tools',
    products: 3,
    followers: 1456,
    points: 2890,
    featured: true
  }
]

export default function Builders() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Wrench className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Meet the Builders
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the creative minds building amazing products on StartUpPush. From <strong>seasoned entrepreneurs</strong> 
            to <strong>first-time makers</strong>, see who's creating the next generation of innovative products.
          </p>
        </div>

        {/* Featured Builders */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            Featured Builders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builders.filter(builder => builder.featured).map((builder) => (
              <div
                key={builder.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={builder.avatar}
                    alt={builder.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{builder.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>🔥 {builder.points}</span>
                      <span>•</span>
                      <span>{builder.products} products</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{builder.bio}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <Users className="inline h-4 w-4 mr-1" />
                    {builder.followers} followers
                  </span>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Builders */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">All Builders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builders.map((builder) => (
              <div
                key={builder.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={builder.avatar}
                    alt={builder.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{builder.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>🔥 {builder.points}</span>
                      <span>•</span>
                      <span>{builder.products} products</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{builder.bio}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <Users className="inline h-4 w-4 mr-1" />
                    {builder.followers} followers
                  </span>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to join the builders?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start building and share your products with the community.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/submit">
              <Button size="lg" className="px-8">
                Submit Your Product
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" size="lg" className="px-8">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
