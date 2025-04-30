import { authMiddleware } from "@clerk/nextjs";

// Use the authMiddleware to handle authentication
const middleware = authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/api/public(.*)"],
});

export default middleware;

// Export the config separately
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 