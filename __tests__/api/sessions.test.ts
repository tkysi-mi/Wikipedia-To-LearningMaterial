import { describe, it, expect, beforeEach } from 'vitest';
import { POST as createSession } from '@/app/api/sessions/route';
import { POST as submitAnswer } from '@/app/api/sessions/[id]/answers/route';
import { GET as getResult } from '@/app/api/sessions/[id]/result/route';
import { NextRequest } from 'next/server';
import { sessionStore } from '@/lib/session/sessionStore';
import type { LearningMaterial } from '@/types/learning-material';

describe('Sessions API', () => {
  let mockMaterial: LearningMaterial;

  beforeEach(() => {
    mockMaterial = {
      id: 'test-material-id',
      wikipediaUrl: 'https://ja.wikipedia.org/wiki/Test',
      articleTitle: 'Test Article',
      articleText: 'Test content',
      summary: 'Test summary',
      questions: [
        {
          id: 'q1',
          questionText: 'Question 1',
          correctAnswer: true,
          explanation: 'Explanation 1',
          order: 1,
        },
        {
          id: 'q2',
          questionText: 'Question 2',
          correctAnswer: false,
          explanation: 'Explanation 2',
          order: 2,
        },
      ],
      createdAt: new Date(),
    };

    sessionStore.saveMaterial(mockMaterial);
  });

  describe('POST /api/sessions', () => {
    it('should create a new session', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ materialId: mockMaterial.id }),
      });

      const response = await createSession(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('sessionId');
      expect(data).toHaveProperty('questions');
      expect(data.questions).toHaveLength(2);
    });

    it('should return 404 with non-existent material ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ materialId: 'non-existent-id' }),
      });

      const response = await createSession(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('code', 'MATERIAL_NOT_FOUND');
    });
  });

  describe('POST /api/sessions/[id]/answers', () => {
    it('should submit an answer', async () => {
      const session = sessionStore.createSession(mockMaterial.id);

      const request = new NextRequest(
        `http://localhost:3000/api/sessions/${session.sessionId}/answers`,
        {
          method: 'POST',
          body: JSON.stringify({
            sessionId: session.sessionId,
            questionId: 'q1',
            userChoice: true,
          }),
        }
      );

      const response = await submitAnswer(request, {
        params: Promise.resolve({ id: session.sessionId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('isCorrect', true);
      expect(data).toHaveProperty('explanation');
    });

    it('should return 404 with non-existent session ID', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/sessions/non-existent-id/answers',
        {
          method: 'POST',
          body: JSON.stringify({
            sessionId: 'non-existent-id',
            questionId: 'q1',
            userChoice: true,
          }),
        }
      );

      const response = await submitAnswer(request, {
        params: Promise.resolve({ id: 'non-existent-id' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
    });
  });

  describe('GET /api/sessions/[id]/result', () => {
    it('should get session result', async () => {
      const session = sessionStore.createSession(mockMaterial.id);

      // Submit some answers
      sessionStore.submitAnswer(session.sessionId, {
        answerId: 'a1',
        questionId: 'q1',
        userChoice: true,
        isCorrect: true,
        answeredAt: new Date(),
      });

      sessionStore.submitAnswer(session.sessionId, {
        answerId: 'a2',
        questionId: 'q2',
        userChoice: true,
        isCorrect: false,
        answeredAt: new Date(),
      });

      const request = new NextRequest(
        `http://localhost:3000/api/sessions/${session.sessionId}/result?sessionId=${session.sessionId}`
      );

      const response = await getResult(request, {
        params: Promise.resolve({ id: session.sessionId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('correctCount', 1);
      expect(data).toHaveProperty('incorrectCount', 1);
      expect(data).toHaveProperty('correctRate', 50);
    });

    it('should return 404 with non-existent session ID', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/sessions/non-existent-id/result?sessionId=non-existent-id'
      );

      const response = await getResult(request, {
        params: Promise.resolve({ id: 'non-existent-id' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
    });
  });
});
