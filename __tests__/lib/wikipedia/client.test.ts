import { fetchArticle } from '@/lib/wikipedia/client';
import { vi, describe, it, expect, beforeEach, afterEach, type Mock } from 'vitest';

describe('fetchArticle', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch article successfully', async () => {
    const mockResponse = {
      query: {
        pages: {
          '123': {
            pageid: 123,
            title: 'React',
            extract: 'React is a JavaScript library...',
          },
        },
      },
    };

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchArticle('React', 'ja');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('React');
      expect(result.data.text).toBe('React is a JavaScript library...');
    }
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should return error when article not found', async () => {
    const mockResponse = {
      query: {
        pages: {
          '-1': {
            pageid: -1,
            title: 'NonExistentArticle',
            missing: '',
          },
        },
      },
    };

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchArticle('NonExistentArticle', 'ja');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('記事が見つかりませんでした');
    }
  });

  it('should return error when API fails', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    });

    const result = await fetchArticle('React', 'ja');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Wikipedia API request failed');
    }
  });

  it('should return error when network error occurs', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Network error'));

    const result = await fetchArticle('React', 'ja');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Wikipedia APIへの接続に失敗しました');
    }
  });
});
