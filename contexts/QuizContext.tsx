'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { LearningMaterial, QuizQuestion } from '@/types/learning-material';
import type { Answer } from '@/types/learning-session';
import type { QuizChoice } from '@/types/common';

interface QuizContextType {
  sessionId: string | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  currentQuestion: QuizQuestion | null;
  answers: Answer[];
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  startSession: (material: LearningMaterial) => Promise<void>;
  submitAnswer: (userChoice: QuizChoice) => Promise<boolean>;
  goToNext: () => void;
  reset: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex] || null;

  const startSession = useCallback(
    async (material: LearningMaterial) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ materialId: material.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || 'セッションの開始に失敗しました'
          );
        }

        const { data } = await response.json();

        setSessionId(data.sessionId);
        setQuestions(material.questions);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setIsCompleted(false);

        router.push('/quiz');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '予期せぬエラーが発生しました'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const submitAnswer = useCallback(
    async (userChoice: QuizChoice): Promise<boolean> => {
      if (!sessionId || !currentQuestion) return false;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/sessions/${sessionId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            userAnswer: userChoice,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || '回答の送信に失敗しました'
          );
        }

        const { data } = await response.json();

        // Create a local answer object to update state
        // Note: The server creates the canonical Answer object, but we replicate it here for UI state
        // Ideally we would get the full Answer object back from the API
        const newAnswer: Answer = {
          answerId: 'temp-id', // We don't strictly need the server ID for UI display
          questionId: currentQuestion.id,
          userChoice,
          isCorrect: data.isCorrect,
          answeredAt: new Date(),
        };

        setAnswers((prev) => [...prev, newAnswer]);

        return data.isCorrect;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '予期せぬエラーが発生しました'
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, currentQuestion]
  );

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      router.push('/results');
    }
  }, [currentQuestionIndex, questions.length, router]);

  const reset = useCallback(() => {
    setSessionId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setError(null);
  }, []);

  return (
    <QuizContext.Provider
      value={{
        sessionId,
        questions,
        currentQuestionIndex,
        currentQuestion,
        answers,
        isCompleted,
        isLoading,
        error,
        startSession,
        submitAnswer,
        goToNext,
        reset,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
