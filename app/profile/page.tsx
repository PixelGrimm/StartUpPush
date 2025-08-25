"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Globe, Twitter, Github, Linkedin, Edit, Save, X, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: ''
  })
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPassword: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    // Fetch user profile and password status
    fetchProfile()
    checkPasswordStatus()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: data.user.name || '',
          username: data.user.username || '',
          bio: data.user.bio || '',
          website: data.user.website || '',
          twitter: data.user.twitter || '',
          github: data.user.github || '',
          linkedin: data.user.linkedin || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        setIsEditing(false)
        await fetchProfile() // Refresh profile data
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const checkPasswordStatus = async () => {
    try {
      const response = await fetch('/api/user/has-password')
      if (response.ok) {
        const data = await response.json()
        setHasPassword(data.hasPassword)
      }
    } catch (error) {
      console.error('Error checking password status:', error)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/change-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailForm),
      })

      if (response.ok) {
        setShowChangeEmail(false)
        setEmailForm({ newEmail: '', currentPassword: '' })
        // Refresh session to get updated email
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to change email')
      }
    } catch (error) {
      console.error('Error changing email:', error)
      alert('Failed to change email')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (response.ok) {
        setShowChangePassword(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        alert('Password changed successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-2xl">{profile.name || 'Your Profile'}</CardTitle>
                    <CardDescription>
                      @{profile.username || 'username'}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                >
                  {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={profile.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      required
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Social Links</Label>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Twitter username"
                          value={profile.twitter}
                          onChange={(e) => handleInputChange('twitter', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="GitHub username"
                          value={profile.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="LinkedIn profile URL"
                          value={profile.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !profile.name || !profile.username}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Display Profile Info */}
                  <div className="space-y-4">
                    {profile.bio && (
                      <div>
                        <Label className="text-sm font-medium">Bio</Label>
                        <p className="text-muted-foreground">{profile.bio}</p>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div>
                        <Label className="text-sm font-medium">Website</Label>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    )}

                    {(profile.twitter || profile.github || profile.linkedin) && (
                      <div>
                        <Label className="text-sm font-medium">Social Links</Label>
                        <div className="flex space-x-4 mt-2">
                          {profile.twitter && (
                            <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Twitter
                            </a>
                          )}
                          {profile.github && (
                            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              GitHub
                            </a>
                          )}
                          {profile.linkedin && (
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Settings */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    
                    {/* Email Change */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Email Address</Label>
                          <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowChangeEmail(!showChangeEmail)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Change Email
                        </Button>
                      </div>

                      {showChangeEmail && (
                        <Card className="p-4">
                          <form onSubmit={handleEmailChange} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="newEmail">New Email Address</Label>
                              <Input
                                id="newEmail"
                                type="email"
                                value={emailForm.newEmail}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={emailForm.currentPassword}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Changing...' : 'Change Email'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowChangeEmail(false)
                                  setEmailForm({ newEmail: '', currentPassword: '' })
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </Card>
                      )}
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Password</Label>
                          <p className="text-sm text-muted-foreground">
                            {hasPassword === null ? 'Checking...' : 
                             hasPassword ? '••••••••' : 'No password set'}
                          </p>
                        </div>
                        {hasPassword ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowChangePassword(!showChangePassword)}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/password-setup')}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Set Password
                          </Button>
                        )}
                      </div>

                      {showChangePassword && (
                        <Card className="p-4">
                          <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPasswordChange">Current Password</Label>
                              <Input
                                id="currentPasswordChange"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <div className="relative">
                                <Input
                                  id="newPassword"
                                  type={showPassword ? "text" : "password"}
                                  value={passwordForm.newPassword}
                                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                  required
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Changing...' : 'Change Password'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowChangePassword(false)
                                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
