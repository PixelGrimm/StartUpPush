import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and description */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="font-bold text-lg">StartUpPush</span>
          </div>
          
          {/* Links */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/advertise" className="hover:text-foreground transition-colors">
              Advertise
            </Link>
            <Link href="/rules" className="hover:text-foreground transition-colors">
              Rules
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 StartUpPush. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
