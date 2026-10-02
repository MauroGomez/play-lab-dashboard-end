import 'server-only';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { z } from 'zod';
import type { Role, User } from '@/model/definitions';
import { authConfig, authEnabled } from './auth.config';

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
  ...authConfig,
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
});

// Role of the logged-in user. With authentication disabled everyone is admin.
export async function getCurrentRole(): Promise<Role | undefined> {
  if (!authEnabled) return 'admin';
  const session = await auth();
  return session?.user?.role;
}
