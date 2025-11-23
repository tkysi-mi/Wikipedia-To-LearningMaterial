import { describe, it, expect, vi } from 'vitest';
import { handleApiError, AppError } from '@/lib/utils/errorHandlers';
import { ZodError } from 'zod';

// Mock NextResponse.json
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, options) => ({ body, options })),
  },
}));

describe('handleApiError', () => {
  it('should handle AppError correctly', () => {
    const error = new AppError('INVALID_REQUEST', 'Test error', 400);
    const response = handleApiError(error) as unknown as {
      body: unknown;
      options: { status: number };
    };

    expect(response.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Test error',
        details: undefined,
      },
    });
    expect(response.options.status).toBe(400);
  });

  it('should handle ZodError correctly', () => {
    const error = new ZodError([
      { code: 'custom', path: [], message: 'Validation failed' },
    ]);
    const response = handleApiError(error) as unknown as {
      body: { error: { code: string; message: string } };
      options: { status: number };
    };

    expect(response.body.error.code).toBe('INVALID_REQUEST');
    expect(response.body.error.message).toBe('Validation Error');
    expect(response.options.status).toBe(400);
  });

  it('should handle generic Error correctly', () => {
    const error = new Error('Something went wrong');
    const response = handleApiError(error) as unknown as {
      body: { error: { code: string; message: string } };
      options: { status: number };
    };

    expect(response.body.error.code).toBe('INTERNAL_ERROR');
    expect(response.body.error.message).toBe('予期せぬエラーが発生しました');
    expect(response.options.status).toBe(500);
  });

  it('should handle Material not found error specifically', () => {
    const error = new Error('Material not found');
    const response = handleApiError(error) as unknown as {
      body: { error: { code: string; message: string } };
      options: { status: number };
    };

    expect(response.body.error.code).toBe('MATERIAL_NOT_FOUND');
    expect(response.body.error.message).toBe('教材が見つかりません');
    expect(response.options.status).toBe(404);
  });
});
