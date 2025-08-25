"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useSessionRefresh } from '@/lib/hooks/useSessionRefresh'
import { Search, Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppStore } from '@/lib/store'
import { NotificationDropdown } from '@/components/notification-dropdown'

export function Header() {
  const { data: session } = useSession()
  const { refreshSession } = useSessionRefresh()
  const { searchQuery, setSearchQuery } = useAppStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rocket Body (white outline) */}
                <path d="M8 3 L10 6 L10 12 L6 12 L6 6 Z" stroke="white" strokeWidth="1" fill="none"/>
                
                {/* Nose Cone Tip (white) */}
                <path d="M8 3 L9 4 L7 4 Z" fill="white" stroke="white" strokeWidth="0.5"/>
                
                {/* Window/Detail (white) */}
                <circle cx="8" cy="8" r="1.5" fill="none" stroke="white" strokeWidth="1"/>
                
                {/* Fins (white) */}
                <path d="M6 10 L4 12 L6 12 Z" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M10 10 L12 12 L10 12 Z" fill="none" stroke="white" strokeWidth="1"/>
                
                {/* Exhaust/Thrust (white) */}
                <line x1="7" y1="12" x2="6" y2="13" stroke="white" strokeWidth="1"/>
                <line x1="8" y1="12" x2="8" y2="13" stroke="white" strokeWidth="1"/>
                <line x1="9" y1="12" x2="10" y2="13" stroke="white" strokeWidth="1"/>
              </svg>
            </div>
            <span className="font-bold text-xl">StartUpPush</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/advertise" className="text-sm font-medium hover:text-primary transition-colors">
            Advertise
          </Link>
          <Link href="/rules" className="text-sm font-medium hover:text-primary transition-colors">
            Rules
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors p-0 h-auto">
                Explore
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/explore">Explore All</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/categories">Categories</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/builders">Builders</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4 ml-8">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* StartUpPush Points - Only show when logged in */}
          {session && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-white dark:from-purple-900/20 dark:to-gray-800 border border-purple-200 dark:border-purple-700 rounded-full px-3 py-1">
                                      <span className="text-purple-600 dark:text-purple-400 text-sm">🔥</span>
                        <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">{(session.user as any)?.points || 0}</span>
                        <span className="text-purple-600 dark:text-purple-400 text-sm">StartUpPush</span>
            </div>
          )}

          {/* Notifications - Only show when logged in */}
          {session && <NotificationDropdown />}

          {/* User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/submit">Submit Project</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Login</Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
