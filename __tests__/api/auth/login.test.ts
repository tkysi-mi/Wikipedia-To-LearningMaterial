import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';

// Mock cookies
vi.mock('next/headers', () => ({
  cookies: () => ({
    set: vi.fn(),
  }),
}));

describe('POST /api/auth/login', () => {
  it('should return 200 and set cookie with correct password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        password: process.env.AUTH_PASSWORD || 'test-password',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty('authenticated', true);
  });

  it('should return 401 with incorrect password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'wrong-password' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('should return 400 with missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
});
