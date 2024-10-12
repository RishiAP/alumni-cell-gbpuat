import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookies = parse(request.headers.get('cookie') || '');
  
  if (cookies.jwtAccessToken && cookies.jwtAccessToken.length > 0) {
    try {
      // Replace 'your-secret-key' with your actual secret key
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const user=await jwtVerify(cookies.jwtAccessToken, secret);
      if(user!=null && user.payload!=null && !user.payload.profile)
        return NextResponse.redirect(new URL('/be-a-member', request.url));
      return NextResponse.next();
    } catch (err) {
      console.error('JWT verification failed:', err);
    }
  }

  return NextResponse.redirect(new URL('/', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
        '/profile',
    ],
};