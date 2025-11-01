// import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/account(.*)",
//   "/transaction(.*)",
// ]);

// // Create Arcjet middleware
// const aj = arcjet({
//   key: process.env.ARCJET_KEY,
//   // characteristics: ["userId"], // Track based on Clerk userId
//   rules: [
//     // Shield protection for content and security
//     shield({
//       mode: "LIVE",
//     }),
//     detectBot({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       allow: [
//       "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
//       "GO_HTTP", // For Inngest
//       // See the full list at https://arcjet.com/bot-list
//       ],
//     }),
//   ],
// });

// // Create base Clerk middleware
// const clerk = clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();

//   if (!userId && isProtectedRoute(req)) {
//     const { redirectToSignIn } = await auth();
//     return redirectToSignIn();
//   }

//   return NextResponse.next();
// });

// // Chain middlewares - ArcJet runs first, then Clerk
// export default createMiddleware(aj, clerk);

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };







// middleware.js
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard(.*)", "/account(.*)", "/transaction(.*)"];

/**
 * Helper to match protected routes (keeps createRouteMatcher usage local)
 */
function matchProtected(url) {
  try {
    const path = new URL(url).pathname;
    for (const pattern of protectedRoutes) {
      const re = new RegExp(pattern);
      if (re.test(path)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Export a middleware function that dynamically imports heavy libs.
 * Dynamic import keeps the initial module small and avoids bundling everything at build-time.
 */
export async function middleware(req, ev) {
  // Dynamically import Arcjet and Clerk server utilities
  const [{ default: arcjet, createMiddleware: createAjMiddleware, detectBot, shield }, clerkServer] =
    await Promise.all([
      import("@arcjet/next").catch((e) => {
        console.error("Failed to load @arcjet/next in middleware:", e);
        throw e;
      }),
      import("@clerk/nextjs/server").catch((e) => {
        console.error("Failed to load @clerk/nextjs/server in middleware:", e);
        throw e;
      }),
    ]);

  const { clerkMiddleware } = clerkServer;

  // Build Arcjet instance (small config)
  const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
      }),
    ],
  });

  // Create the Clerk middleware handler (server package)
  const clerkHandler = clerkMiddleware(async (auth, req2) => {
    // auth() returns user info; if no user and route protected, redirect to sign-in
    const { userId, redirectToSignIn } = await auth();
    if (!userId && matchProtected(req.url)) {
      return redirectToSignIn();
    }
    return NextResponse.next();
  });

  // Compose Arcjet -> Clerk by using Arcjet's createMiddleware (if present) or fallback
  // Note: createAjMiddleware (named export) may be available; otherwise use default exported function.
  const createAj = createAjMiddleware || ((...args) => arcjet(...args));
  const composed = createAj(aj, clerkHandler);

  // Call the composed middleware with the current request
  // Some middleware handlers expect (req, ev) and return a Response or NextResponse
  const result = await composed(req, ev);
  return result;
}

/**
 * Keep default config — Edge runtime by default.
 * If Vercel still complains about function size you can try switching to runtime: "nodejs",
 * but that previously caused module-not-found for you, so we stay with Edge and keep top-level small.
 */
export const config = {
  matcher: [
    // skip next internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
