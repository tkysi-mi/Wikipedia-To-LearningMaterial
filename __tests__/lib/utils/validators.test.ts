import { describe, it, expect } from 'vitest';
import { validateUrl, validatePassword } from '@/lib/utils/validators';

describe('validateUrl', () => {
  it('should return success for valid Wikipedia URL', () => {
    const result = validateUrl('https://ja.wikipedia.org/wiki/Test');
    expect(result.success).toBe(true);
  });

  it('should return error for non-Wikipedia URL', () => {
    const result = validateUrl('https://google.com');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return error for invalid URL format', () => {
    const result = validateUrl('not-a-url');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('validatePassword', () => {
  it('should return success for non-empty password', () => {
    const result = validatePassword('password123');
    expect(result.success).toBe(true);
  });

  it('should return error for empty password', () => {
    const result = validatePassword('');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
