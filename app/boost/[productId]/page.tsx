"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star, Crown, Zap, Flame } from 'lucide-react'
import { BoostSuccessModal } from '@/components/boost-success-modal'
import { ErrorModal } from '@/components/ui/error-modal'
import { ResetCountdown } from '@/components/reset-countdown'

interface Project {
  id: string
  name: string
  tagline: string
  logo: string | null
}

export default function BoostProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const productId = params.productId as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<'boosted' | 'max-boosted' | 'points' | null>(null)
  const [processing, setProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [boostedPlan, setBoostedPlan] = useState<'boosted' | 'max-boosted' | 'points' | null>(null)
  const [salesData, setSalesData] = useState<any>(null)
  const [loadingSales, setLoadingSales] = useState(true)
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchProject()
    fetchSalesData()
  }, [session, status, router, productId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/boost/sales')
      if (response.ok) {
        const data = await response.json()
        setSalesData(data)
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoadingSales(false)
    }
  }

  const handleBoost = async (plan: 'boosted' | 'max-boosted') => {
    setSelectedPlan(plan)
    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create promotion record
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          type: plan,
          days: plan === 'boosted' ? 7 : 30
        }),
      })

      if (response.ok) {
        // Record the sale
        await fetch('/api/boost/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planType: plan }),
        })
        
        setBoostedPlan(plan)
        setShowSuccessModal(true)
        // Refresh sales data
        fetchSalesData()
      } else {
        throw new Error('Failed to create promotion')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setErrorModal({
        isOpen: true,
        message: 'Payment failed. Please try again.'
      })
    } finally {
      setProcessing(false)
      setSelectedPlan(null)
    }
  }

  const handlePointsBoost = async () => {
    setSelectedPlan('points')
    setProcessing(true)

    try {
      // Use the boost API with points
      const response = await fetch('/api/boost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: productId
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Record the points sale
        await fetch('/api/boost/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planType: 'points' }),
        })
        
        setBoostedPlan('points')
        setShowSuccessModal(true)
        // Refresh sales data
        fetchSalesData()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to boost project')
      }
    } catch (error) {
      console.error('Points boost error:', error)
      setErrorModal({
        isOpen: true,
        message: error instanceof Error ? error.message : 'Failed to boost project. Please try again.'
      })
    } finally {
      setProcessing(false)
      setSelectedPlan(null)
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    setBoostedPlan(null)
    router.push('/dashboard')
  }

  const getPlanAvailability = (planType: string) => {
    if (!salesData?.plans) return { remainingSpots: 0, isSoldOut: false, hasDiscount: true }
    const plan = salesData.plans.find((p: any) => p.planType === planType)
    return plan || { remainingSpots: 0, isSoldOut: false, hasDiscount: true }
  }

  const isPaidPlan = (planType: string) => {
    return planType === 'boosted' || planType === 'max-boosted'
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
                  </div>
      </div>

      {/* Boost Success Modal */}
      {boostedPlan && (
        <BoostSuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseModal}
          planType={boostedPlan}
          projectName=""
        />
      )}
    </div>
  )
}

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Boost Your Project
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your project is live! Now supercharge it with promotion to reach thousands more potential users.
            </p>
            
            {/* Promotional Banner */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200 font-medium">
                  Promoted projects get 8x more engagement than free listings.
                </span>
              </div>
            </div>

            {/* Reset Countdown */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <ResetCountdown className="justify-center" />
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Boosted Plan */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 relative">
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                ★ Most Popular
              </div>
            </div>
            
            {/* Scarcity Badge */}
            <div className="absolute -top-3 -right-3">
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {loadingSales ? '...' : `${getPlanAvailability('boosted').remainingSpots} left!`}
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4 mt-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-center mb-4">Boosted</h3>

            {/* Pricing */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-gray-500 line-through">$50</span>
                {getPlanAvailability('boosted').hasDiscount ? (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    -70% OFF
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                    NO DISCOUNT
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold">
                  {getPlanAvailability('boosted').hasDiscount ? '$15' : '$50'}
                </span>
                <span className="text-gray-500">one time / project</span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Powerful SEO backlink for search rankings</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm flex items-center">
                  <Flame className="h-4 w-4 mr-1" />
                  Promotion for 7 days
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Eye-catching design that stands out</span>
              </li>
            </ul>

            {/* CTA Button */}
            <Button
              onClick={() => handleBoost('boosted')}
              disabled={processing}
              className={`w-full mb-3 ${
                getPlanAvailability('boosted').isSoldOut 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              {processing && selectedPlan === 'boosted' ? 'Processing...' : 
               getPlanAvailability('boosted').isSoldOut ? (
                <>
                  <span className="mr-2">🔥</span>
                  Buy at Full Price
                </>
               ) : (
                <>
                  <span className="mr-2">🔥</span>
                  Beat the Competition
                </>
              )}
            </Button>

            {/* Scarcity Message */}
            <p className="text-red-500 text-sm text-center">
              {getPlanAvailability('boosted').remainingSpots} spots remaining at this price
            </p>
          </div>

          {/* Max-Boosted Plan */}
          <div className="bg-white dark:bg-gray-800 border-2 border-purple-500 rounded-lg p-6 relative">
            {/* Best Value Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Crown className="h-4 w-4 mr-1" />
                Best Value
              </div>
            </div>
            
            {/* Scarcity Badge */}
            <div className="absolute -top-3 -right-3">
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {loadingSales ? '...' : `${getPlanAvailability('max-boosted').remainingSpots} left!`}
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4 mt-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-center mb-4">Max-Boosted</h3>

            {/* Pricing */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-gray-500 line-through">$175</span>
                {getPlanAvailability('max-boosted').hasDiscount ? (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    -80% OFF
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                    NO DISCOUNT
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold">
                  {getPlanAvailability('max-boosted').hasDiscount ? '$35' : '$175'}
                </span>
                <span className="text-gray-500">one time / project</span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm flex items-center">
                  <Flame className="h-4 w-4 mr-1" />
                  Promotion for 30 days
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Powerful SEO backlink for search rankings</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Premium styling that dominates the page</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Social media promotion to 10K+ followers</span>
              </li>
            </ul>

            {/* CTA Button */}
            <Button
              onClick={() => handleBoost('max-boosted')}
              disabled={processing}
              className={`w-full mb-3 ${
                getPlanAvailability('max-boosted').isSoldOut 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              }`}
            >
              {processing && selectedPlan === 'max-boosted' ? 'Processing...' : 
               getPlanAvailability('max-boosted').isSoldOut ? (
                <>
                  <span className="mr-2">🔥</span>
                  Buy at Full Price
                </>
               ) : (
                <>
                  <span className="mr-2">🔥</span>
                  Dominate Your Niche
                </>
              )}
            </Button>

            {/* Scarcity Message */}
            <p className="text-red-500 text-sm text-center">
              {getPlanAvailability('max-boosted').remainingSpots} spots remaining at this price
            </p>
          </div>

          {/* Points Boost Plan */}
          <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-6 relative">
            {/* Free Option Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                💎 Free Option
              </div>
            </div>
            
            {/* Scarcity Badge */}
            <div className="absolute -top-3 -right-3">
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {loadingSales ? '...' : `${getPlanAvailability('points').remainingSpots} left!`}
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4 mt-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-center mb-4">Points Boost</h3>

            {/* Pricing */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold text-blue-600">50</span>
                <span className="text-gray-500">StartUpPush points</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                one time / project
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Boost for 24 hours</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Enhanced visibility</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">No payment required</span>
              </li>
            </ul>

            {/* CTA Button */}
            <Button
              onClick={() => handlePointsBoost()}
              disabled={processing || getPlanAvailability('points').isSoldOut}
              className={`w-full mb-3 ${
                getPlanAvailability('points').isSoldOut 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {processing && selectedPlan === 'points' ? 'Processing...' : 
               getPlanAvailability('points').isSoldOut ? 'Sold Out - Wait for Reset' : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Boost with Points
                </>
              )}
            </Button>

            {/* Scarcity Message */}
            <p className="text-red-500 text-sm text-center">
              {getPlanAvailability('points').remainingSpots} spots remaining at this price
            </p>
          </div>
        </div>
      </div>

      {/* Boost Success Modal */}
      {boostedPlan && project && (
        <BoostSuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseModal}
          planType={boostedPlan}
          projectName={project.name}
        />
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title="Boost Error"
        message={errorModal.message}
      />
    </div>
  )
}
