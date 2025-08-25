"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FolderOpen, 
  Users, 
  TrendingUp, 
  Star, 
  Rocket,
  ArrowRight 
} from 'lucide-react'

export default function ExplorePage() {
  const exploreSections = [
    {
      title: "Categories",
      description: "Browse products by category - from AI tools to fintech solutions",
      icon: FolderOpen,
      href: "/categories",
      color: "bg-blue-500",
      stats: "50+ categories"
    },
    {
      title: "Builders",
      description: "Discover talented creators and developers behind amazing products",
      icon: Users,
      href: "/builders",
      color: "bg-green-500",
      stats: "1000+ builders"
    },
    {
      title: "Trending",
      description: "See what's hot right now - the most popular products this week",
      icon: TrendingUp,
      href: "/",
      color: "bg-orange-500",
      stats: "Updated daily"
    },
    {
      title: "Featured",
      description: "Products with 50+ votes, 100% upvote ratio, 10+ comments, and 7+ days old",
      icon: Star,
      href: "/featured",
      color: "bg-purple-500",
      stats: "Quality criteria"
    }
  ]

  const quickActions = [
    {
      title: "Submit Your Product",
      description: "Get your product discovered by thousands of users",
      icon: Rocket,
      href: "/submit",
      variant: "default" as const
    },
    {
      title: "Browse Categories",
      description: "Find products in specific categories",
      icon: FolderOpen,
      href: "/categories",
      variant: "outline" as const
    }
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Explore StartUpPush
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover innovative products, talented builders, and trending solutions in one place
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <action.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                          <p className="text-muted-foreground mb-4">{action.description}</p>
                          <Button asChild variant={action.variant}>
                            <Link href={action.href}>
                              Get Started
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Explore Sections */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Explore by Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {exploreSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <Link href={section.href}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${section.color} text-white`}>
                            <section.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {section.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{section.stats}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">
                          {section.description}
                        </CardDescription>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Join the Community</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Be part of a growing community of builders, creators, and innovators. 
                    Discover amazing products and connect with talented developers.
                  </p>
                  <div className="flex flex-wrap justify-center gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary">1000+</div>
                      <div className="text-sm text-muted-foreground">Products</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Builders</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">Categories</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">10K+</div>
                      <div className="text-sm text-muted-foreground">Votes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
