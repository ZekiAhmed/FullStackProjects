import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { sign } from 'crypto'

const isProtected = createRouteMatcher("/")

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtected(req)) {
      await auth.protect()
    }
  },

  {
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}