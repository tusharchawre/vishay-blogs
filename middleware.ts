import NextAuth from "next-auth"
import authConfig from "./auth.config"

import { publicSites, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "./route"
import { NextResponse } from "next/server"




const { auth } = NextAuth(authConfig)



export default auth((req) => {

  //TODO : Middleware this was creating problems with generate api so look into that.
  const { nextUrl } = req

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // Check for dynamic blog routes
  const isBlogRoute = /^\/[^/]+\/[^/]+$/.test(nextUrl.pathname)
  const isPublicSite = publicSites.includes(nextUrl.pathname) || isBlogRoute

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }

    return;
  }

  if (!isLoggedIn && !isPublicSite) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }


  return;

})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}