import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, let's disable middleware to test the app
  // We'll implement proper auth middleware later
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/lista/:path*", 
    "/settings/:path*",
  ],
}
