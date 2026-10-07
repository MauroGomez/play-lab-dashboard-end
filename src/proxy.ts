import { NextResponse } from 'next/server';
import { auth, authEnabled } from '@/auth';

// Authentication only: the `authorized` callback in auth.ts decides
// whether the request needs to be redirected to the login page.
export default authEnabled ? auth : () => NextResponse.next();

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
