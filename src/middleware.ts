import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting for the MVP
// In a production environment, this would use Redis
const rateLimitStore = new Map<string, { count: number, lastReset: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 30; // 30 requests per minute

  // Only rate limit sensitive paths
  if (request.nextUrl.pathname.startsWith('/api/verify') || 
      request.nextUrl.pathname.startsWith('/registry')) {
    
    const record = rateLimitStore.get(ip) || { count: 0, lastReset: now };
    
    if (now - record.lastReset > windowMs) {
      record.count = 0;
      record.lastReset = now;
    }
    
    record.count++;
    rateLimitStore.set(ip, record);
    
    if (record.count > limit) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/registry/:path*'],
};
