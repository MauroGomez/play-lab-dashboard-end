import type { NextAuthConfig } from 'next-auth';
import { canAccessRoute } from '@/lib/authorization';
import type { Role } from '@/model/definitions';

// Authentication is only enforced when both env vars are defined
export const authEnabled = !!process.env.AUTH_SECRET && !!process.env.AUTH_URL;

// Add `role` to the type of the user (and therefore of session.user)
declare module 'next-auth' {
  interface User {
    role?: Role;
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    // By default NextAuth only keeps a few fields (name, email, image) along the way,
    // so any extra field (like `role`) has to be copied explicitly in two steps.
    //
    // Runs on every request, but `user` (what authorize() returned) is only
    // defined on login. The token is stored encrypted in a cookie
    // (kept in the browser and sent along with every request).
    jwt({ token, user }) {
      if (user) token.role = user.role; // 1) user → token (only on login)
      return token;
    },
    // Runs on every request: builds what auth() returns from the token.
    session({ session, token }) {
      session.user.role = token.role as Role | undefined; // 2) token → session (on every request)
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (!isLoggedIn) return false; // Not authenticated: redirect to login page
        if (!canAccessRoute(auth.user?.role, nextUrl.pathname)) {
          // Authenticated but not allowed: redirect to dashboard home
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        // Already logged in: no need to show the login page
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
