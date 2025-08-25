"use client"

import { Lightbulb, Zap, Calendar, TrendingUp, Users, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Rules() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-4xl font-bold text-foreground mb-12 text-center">Platform Rules</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <div className="space-y-4 text-foreground">
                <p className="text-lg text-muted-foreground">
                  StartUpPush is a community-driven product discovery platform with a unique engagement-based 
                  ranking system that rewards collaborative promotion. Transform every creator into an advocate 
                  and climb the rankings by supporting others.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold text-foreground">
                  1
                </div>
                <h2 className="text-2xl font-bold text-foreground">Submit Your Product</h2>
              </div>
              
              <div className="space-y-4 text-foreground">
                <p>
                  Publish your product to StartUpPush to get discovered by our community. This is your first 
                  step toward building visibility and gathering valuable feedback from fellow creators.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Pro Tip</h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        Include compelling descriptions, high-quality visuals, and demo links to maximize 
                        engagement and attract more community members to your product.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold text-foreground">
                  2
                </div>
                <h2 className="text-2xl font-bold text-foreground">Earn StartUpPush Points</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-foreground">
                  Earn StartUpPush Points through community engagement to boost your product's visibility 
                  and ranking:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                  <li><strong>Upvote products:</strong> Earn 1 point for upvoting others' products</li>
                  <li><strong>Comment on products:</strong> Earn 1 point for commenting on others' products</li>
                  <li><strong>Follow products:</strong> Earn 1 point for following others' products</li>
                </ul>

                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Community Power</h4>
                      <p className="text-purple-800 dark:text-purple-200 text-sm">
                        Your success is directly tied to helping your peers succeed—true community-powered discovery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Daily Limits</h4>
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        You can earn up to 20 points per day from sharing, up to 20 points per day from upvoting, 
                        up to 20 points per day from commenting, and up to 40 points per day from following.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold text-foreground">
                  3
                </div>
                <h2 className="text-2xl font-bold text-foreground">Rankings & Dynamic Badges</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-foreground">
                  Products are ranked by StartUpPush Points and community upvotes within selected time periods. 
                  Top performers earn dynamic badges that showcase their success.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                      Points
                    </span>
                    <span className="text-foreground">StartUpPush Points earned from community sharing and engagement</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                      Upvotes
                    </span>
                    <span className="text-foreground">Community votes from fellow creators</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                      Badges
                    </span>
                    <span className="text-foreground">Trending, Product of the Day/Week/Month recognition</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t pt-8 mt-12">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Ready to Propel Your Product?</h2>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-muted-foreground">
                    Join the community-driven directory where your success is powered by peers!
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Link href="/submit">
                    <Button size="lg" className="px-8">
                      Submit Your Product
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="lg" className="px-8">
                      Explore Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
