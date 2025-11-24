import { generateQuestions } from '@/lib/openai/generateQuestions';
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

describe('generateQuestions', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should generate questions successfully', async () => {
    const mockQuestions = [
      { text: 'Q1', correctAnswer: true, explanation: 'Exp1' },
      { text: 'Q2', correctAnswer: false, explanation: 'Exp2' },
    ];

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({ questions: mockQuestions }),
          },
        },
      ],
    };

    (openai.chat.completions.create as Mock).mockResolvedValue(mockResponse);

    const articleText = 'Article text...';
    const result = await generateQuestions(articleText);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0].questionText).toBe('Q1');
      expect(result.data[0].correctAnswer).toBe(true);
      expect(result.data[0].id).toBeDefined();
      expect(result.data[0].order).toBe(1);
    }
  });

  it('should handle array response format', async () => {
    const mockQuestions = [{ text: 'Q1', correctAnswer: true }];

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify(mockQuestions),
          },
        },
      ],
    };

    (openai.chat.completions.create as Mock).mockResolvedValue(mockResponse);

    const result = await generateQuestions('text');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
    }
  });

  it('should return error when JSON is invalid', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Invalid JSON',
          },
        },
      ],
    };

    (openai.chat.completions.create as Mock).mockResolvedValue(mockResponse);

    const result = await generateQuestions('text');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('JSONの解析に失敗しました');
    }
  });

  it('should return error when API fails', async () => {
    (openai.chat.completions.create as Mock).mockRejectedValue(
      new Error('API Error')
    );

    const result = await generateQuestions('text');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('問題の生成中にエラーが発生しました');
    }
  });

  it('should return error when input is empty', async () => {
    const result = await generateQuestions('');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('記事本文が空です');
    }
  });
});
