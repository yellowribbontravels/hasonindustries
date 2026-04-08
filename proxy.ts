import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.auth) {
      return Response.redirect(new URL('/admin/login', req.url))
    }
  }
})

export const config = {
  matcher: ['/admin/:path*']
}
