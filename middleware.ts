import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Debug logging
    console.log('Middleware - Pathname:', pathname)
    console.log('Middleware - Token:', token ? 'exists' : 'none')
    console.log('Middleware - isProfileComplete:', token?.isProfileComplete)

    // If user is authenticated but profile is not complete
    if (token && !token.isProfileComplete && pathname !== '/profile-setup') {
      console.log('Middleware - Redirecting to profile setup')
      return NextResponse.redirect(new URL('/profile-setup', req.url))
    }

    // If user is authenticated and profile is complete, check password
    if (token && token.isProfileComplete) {
      // Allow access to password setup and profile setup
      if (pathname === '/password-setup' || pathname === '/profile-setup') {
        console.log('Middleware - Allowing access to setup pages')
        return NextResponse.next()
      }
      
      // Check admin access for admin pages
      if (pathname.startsWith('/admin')) {
        const adminEmails = ['alexszabo89@icloud.com', 'admin@startuppush.com']
        if (!token.email || !adminEmails.includes(token.email)) {
          console.log('Middleware - Non-admin user trying to access admin page, redirecting to home')
          return NextResponse.redirect(new URL('/', req.url))
        }
        console.log('Middleware - Admin access granted')
        return NextResponse.next()
      }
      
      // For other pages, we'll let the page handle password checks
      console.log('Middleware - Profile complete, allowing access')
      return NextResponse.next()
    }

    // For unauthenticated users, allow access to public pages
    console.log('Middleware - Unauthenticated, allowing access')
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public pages that don't require authentication
        const publicPages = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/check-setup',
          '/privacy',
          '/terms',
          '/advertise',
          '/rules',
          '/categories',
          '/builders',
          '/blog',
          '/p/',
          '/categories/',
          '/api/auth/',
          '/api/products',
          '/api/vote',
          '/password-setup',
          '/profile-setup'
        ]

        // Check if current path is a public page
        const isPublicPage = publicPages.some(page => 
          pathname === page || pathname.startsWith(page)
        )

        // Allow access to public pages
        if (isPublicPage) {
          return true
        }

        // Require authentication for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
