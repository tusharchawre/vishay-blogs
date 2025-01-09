import { auth } from "@/auth"
 
export default auth((req) => {
    const {nextUrl} = req
    const isLoggedIn = !!req.auth

    const pathname = nextUrl.pathname

    if(pathname === "/create"){
        if(!isLoggedIn){
            return Response.redirect(new URL("/login", nextUrl))
        }

        return ;
    }

    

})
 

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}