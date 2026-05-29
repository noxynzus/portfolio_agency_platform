import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"
  
  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }
  
  // Redirect logged-in admins away from login page
  if (pathname === '/login' && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)"
  ]
}
