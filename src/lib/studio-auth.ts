import { createHash } from 'crypto';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'atelier_studio_session';

export function accessCode() {
  return process.env.STUDIO_ACCESS_CODE || '9100';
}

export function studioToken() {
  return createHash('sha256').update(`tare-atelier:${accessCode()}`).digest('hex');
}

export function isStudioAuthorized(request: NextRequest) {
  return request.cookies.get(COOKIE_NAME)?.value === studioToken();
}

export { COOKIE_NAME };
