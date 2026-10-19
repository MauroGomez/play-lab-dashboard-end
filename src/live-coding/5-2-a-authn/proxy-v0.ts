import { NextResponse } from 'next/server';

export default () => NextResponse.next();

// Authentication only: the `authorized` callback in auth.ts decides
// whether the request needs to be redirected to the login page.
// export default auth;

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };
