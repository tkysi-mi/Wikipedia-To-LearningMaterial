'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizCard } from '@/components/QuizCard';
import type { QuizChoice } from '@/types/common';

export default function QuizPage() {
  const {
    sessionId,
    questions,
    currentQuestionIndex,
    currentQuestion,
    submitAnswer,
    goToNext,
    isLoading,
    error,
  } = useQuiz();

  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: QuizChoice;
    userChoice: QuizChoice;
  } | null>(null);

  // Redirect if no session
  useEffect(() => {
    if (!sessionId && !isLoading) {
      router.replace('/');
    }
  }, [sessionId, isLoading, router]);

  // Reset feedback when question changes
  useEffect(() => {
    setFeedback(null);
  }, [currentQuestionIndex]);

  if (!sessionId || !currentQuestion) {
    return null; // Or loading spinner
  }

  const handleAnswer = async (choice: QuizChoice) => {
    const isCorrect = await submitAnswer(choice);

    setFeedback({
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      userChoice: choice,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-8">学習セッション</h2>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <QuizCard
        question={currentQuestion}
        currentNumber={currentQuestionIndex + 1}
        totalNumber={questions.length}
        onAnswer={handleAnswer}
        onNext={goToNext}
        feedback={feedback}
      />
    </div>
  );
}
