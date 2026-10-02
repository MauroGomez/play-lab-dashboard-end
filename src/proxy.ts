import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig, authEnabled } from './auth.config';

export default authEnabled
  ? NextAuth(authConfig).auth
  : () => NextResponse.next();

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
