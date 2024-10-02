import { NextResponse } from 'next/server';
import { getIpAddress } from './api/ip/route.js';

export function middleware(req) {
  const ip = getIpAddress(req);

  const response = NextResponse.next();
  response.headers.set('x-user-ip', ip);

  return response;
}

export const config = {
  matcher: ['/'],
};
