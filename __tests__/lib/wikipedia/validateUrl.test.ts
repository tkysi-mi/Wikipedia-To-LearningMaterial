import { validateWikipediaUrl } from '@/lib/wikipedia/validateUrl';

describe('validateWikipediaUrl', () => {
  it('should validate valid Japanese Wikipedia URL', () => {
    const url = 'https://ja.wikipedia.org/wiki/React';
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lang).toBe('ja');
      expect(result.data.title).toBe('React');
    }
  });

  it('should validate valid English Wikipedia URL', () => {
    const url = 'https://en.wikipedia.org/wiki/Next.js';
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lang).toBe('en');
      expect(result.data.title).toBe('Next.js');
    }
  });

  it('should validate URL with encoded title', () => {
    const url = 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC'; // 日本
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lang).toBe('ja');
      expect(result.data.title).toBe('日本');
    }
  });

  it('should fail for non-Wikipedia URL', () => {
    const url = 'https://google.com';
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(false);
  });

  it('should fail for unsupported language', () => {
    const url = 'https://fr.wikipedia.org/wiki/Paris';
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(false);
  });

  it('should fail for non-article URL', () => {
    const url = 'https://ja.wikipedia.org/w/index.php';
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(false);
  });

  it('should fail for invalid URL format', () => {
    const url = 'not-a-url';
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(false);
  });

  it('should fail for empty URL', () => {
    const url = '';
    const result = validateWikipediaUrl(url);
    expect(result.success).toBe(false);
  });
});
