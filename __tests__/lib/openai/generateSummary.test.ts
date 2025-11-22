import { generateSummary } from '@/lib/openai/generateSummary';
import { openai } from '@/lib/openai/client';
import { vi, describe, it, expect, afterEach, type Mock } from 'vitest';

// OpenAIクライアントのモック
vi.mock('@/lib/openai/client', () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

describe('generateSummary', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should generate summary successfully', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Summary line 1\nSummary line 2\nSummary line 3',
          },
        },
      ],
    };

    (openai.chat.completions.create as Mock).mockResolvedValue(mockResponse);

    const articleText = 'Long article text...';
    const result = await generateSummary(articleText);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('Summary line 1\nSummary line 2\nSummary line 3');
    }
    expect(openai.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining(articleText),
          }),
        ]),
      }),
      expect.objectContaining({
        timeout: 60000,
      })
    );
  });

  it('should return error when API fails', async () => {
    (openai.chat.completions.create as Mock).mockRejectedValue(new Error('API Error'));

    const result = await generateSummary('text');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('要約の生成中にエラーが発生しました');
    }
  });

  it('should return error when response is empty', async () => {
    const mockResponse = {
      choices: [],
    };

    (openai.chat.completions.create as Mock).mockResolvedValue(mockResponse);

    const result = await generateSummary('text');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('要約の生成に失敗しました');
    }
  });

  it('should return error when input is empty', async () => {
    const result = await generateSummary('');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('記事本文が空です');
    }
  });
});
