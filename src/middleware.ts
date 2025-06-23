// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/"
]);

export default clerkMiddleware((auth, req) => {
  // ✅ Do nothing for public routes (no redirect)
  if (isPublicRoute(req)) return;

  // ✅ Clerk automatically protects the route — no need to call `.protect()`
});
  
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // matches all routes except static files
};
