/* eslint-disable @typescript-eslint/no-unused-vars */
import { sessionStore } from '@/lib/session/sessionStore';
import type { LearningMaterial } from '@/types/learning-material';
import type { Answer } from '@/types/learning-session';
import { describe, it, expect, beforeEach } from 'vitest';

describe('sessionStore', () => {
  const mockMaterial: LearningMaterial = {
    id: 'material-1',
    wikipediaUrl: 'https://ja.wikipedia.org/wiki/Test',
    articleTitle: 'Test Article',
    articleText: 'Test text',
    summary: 'Test summary',
    questions: [
      {
        id: 'q1',
        questionText: 'Question 1',
        correctAnswer: true,
        explanation: 'exp1',
        order: 1,
      },
      {
        id: 'q2',
        questionText: 'Question 2',
        correctAnswer: false,
        explanation: 'exp2',
        order: 2,
      },
    ],
    createdAt: new Date(),
  };

  beforeEach(() => {
    // Reset store state if possible, or just use fresh IDs
    // Since sessionStore is a singleton with private maps, we can't easily reset it.
    // We'll just save the material again.
    sessionStore.saveMaterial(mockMaterial);
  });

  describe('createSession', () => {
    it('should create a new session correctly', () => {
      const session = sessionStore.createSession(mockMaterial.id);

      expect(session).toBeDefined();
      expect(session.sessionId).toBeDefined();
      expect(session.questions).toEqual(mockMaterial.questions);
      expect(session.currentQuestionNumber).toBe(1);
      expect(session.answerHistory).toEqual([]);
      expect(session.correctCount).toBe(0);
      expect(session.status).toBe('in_progress');
      expect(session.startedAt).toBeInstanceOf(Date);
      expect(session.completedAt).toBeNull();
    });

    it('should throw error if material not found', () => {
      expect(() => {
        sessionStore.createSession('non-existent-id');
      }).toThrow('Material not found');
    });
  });

  describe('submitAnswer', () => {
    it('should record a correct answer', () => {
      const session = sessionStore.createSession(mockMaterial.id);
      const answer: Answer = {
        answerId: 'a1',
        questionId: 'q1',
        userChoice: true,
        isCorrect: true,
        answeredAt: new Date(),
      };

      const updatedSession = sessionStore.submitAnswer(
        session.sessionId,
        answer
      );

      expect(updatedSession.answerHistory).toHaveLength(1);
      expect(updatedSession.answerHistory[0]).toEqual(answer);
      expect(updatedSession.correctCount).toBe(1);
      expect(updatedSession.currentQuestionNumber).toBe(2);
    });

    it('should record an incorrect answer', () => {
      const session = sessionStore.createSession(mockMaterial.id);
      const answer: Answer = {
        answerId: 'a1',
        questionId: 'q1',
        userChoice: false,
        isCorrect: false,
        answeredAt: new Date(),
      };

      const updatedSession = sessionStore.submitAnswer(
        session.sessionId,
        answer
      );

      expect(updatedSession.answerHistory).toHaveLength(1);
      expect(updatedSession.correctCount).toBe(0);
      expect(updatedSession.currentQuestionNumber).toBe(2);
    });

    it('should complete session after last question', () => {
      const session = sessionStore.createSession(mockMaterial.id);

      // Answer question 1
      sessionStore.submitAnswer(session.sessionId, {
        answerId: 'a1',
        questionId: 'q1',
        userChoice: true,
        isCorrect: true,
        answeredAt: new Date(),
      });

      // Answer question 2 (last one)
      const updatedSession = sessionStore.submitAnswer(session.sessionId, {
        answerId: 'a2',
        questionId: 'q2',
        userChoice: false,
        isCorrect: true, // q2 correct answer is false, user chose false -> correct
        answeredAt: new Date(),
      });

      expect(updatedSession.status).toBe('completed');
      expect(updatedSession.completedAt).toBeInstanceOf(Date);
      expect(updatedSession.currentQuestionNumber).toBe(2);
    });
  });

  describe('calculateResult', () => {
    it('should calculate result correctly', () => {
      const session = sessionStore.createSession(mockMaterial.id);

      // 1 correct, 1 incorrect
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
        userChoice: true, // Correct is false
        isCorrect: false,
        answeredAt: new Date(),
      });

      const result = sessionStore.calculateResult(session.sessionId);

      expect(result.correctCount).toBe(1);
      expect(result.incorrectCount).toBe(1);
      expect(result.correctRate).toBe(50);
      expect(result.answerHistory).toHaveLength(2);
    });
  });
});
