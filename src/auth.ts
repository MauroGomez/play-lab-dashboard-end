import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { z } from 'zod';
import type { Role, User } from '@/model/definitions';

// Authentication is on by default; set AUTH_DISABLED=true to turn it off (development only).
// Compare against the exact string: env vars are strings, so "false" would be truthy.
export const authEnabled = process.env.AUTH_DISABLED !== 'true';
if (!authEnabled && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_DISABLED=true is not allowed in production');
}

// Add `role` to the type of the user (and therefore of session.user)
declare module 'next-auth' {
  interface User {
    role?: Role;
  }
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          // Return only what NextAuth needs (never the password hash)
          if (passwordsMatch) {
            return { id: user.id, name: user.name, email: user.email, role: user.role };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
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
    // Used by the proxy (src/proxy.ts) on every request
    authorized({ auth, request: { nextUrl } }) {
      // const isLoggedIn = !!auth?.user;
      console.log("auth:", auth);
      const isLoggedIn = !!auth;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Not authenticated: redirect to login page
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        // Already logged in: no need to show the login page
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
});
