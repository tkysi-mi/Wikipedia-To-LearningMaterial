import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/materials/route';
import { NextRequest } from 'next/server';
import * as wikipediaClient from '@/lib/wikipedia/client';
import * as openaiSummary from '@/lib/openai/generateSummary';
import * as openaiQuestions from '@/lib/openai/generateQuestions';

// Mock Wikipedia client
vi.mock('@/lib/wikipedia/client');
// Mock OpenAI functions
vi.mock('@/lib/openai/generateSummary');
vi.mock('@/lib/openai/generateQuestions');

describe('POST /api/materials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 with valid Wikipedia URL', async () => {
    // Mock Wikipedia fetchArticle
    vi.mocked(wikipediaClient.fetchArticle).mockResolvedValue({
      success: true,
      data: {
        title: 'Test Article',
        text: 'This is a test article content.',
      },
    });

    // Mock OpenAI generateSummary
    vi.mocked(openaiSummary.generateSummary).mockResolvedValue({
      success: true,
      data: 'Test summary in 3 sentences.',
    });

    // Mock OpenAI generateQuestions
    vi.mocked(openaiQuestions.generateQuestions).mockResolvedValue({
      success: true,
      data: Array.from({ length: 10 }, (_, i) => ({
        id: `q${i + 1}`,
        questionText: `Question ${i + 1}`,
        correctAnswer: i % 2 === 0,
        explanation: `Explanation ${i + 1}`,
        order: i + 1,
      })),
    });

    const request = new NextRequest('http://localhost:3000/api/materials', {
      method: 'POST',
      body: JSON.stringify({
        wikipediaUrl: 'https://ja.wikipedia.org/wiki/Test',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toHaveProperty('id');
    expect(data.data).toHaveProperty('summary');
    expect(data.data).toHaveProperty('questions');
    expect(data.data.questions).toHaveLength(10);
  });

  it('should return 400 with invalid URL', async () => {
    const request = new NextRequest('http://localhost:3000/api/materials', {
      method: 'POST',
      body: JSON.stringify({ wikipediaUrl: 'https://google.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('should return 400 with missing URL', async () => {
    const request = new NextRequest('http://localhost:3000/api/materials', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
});
