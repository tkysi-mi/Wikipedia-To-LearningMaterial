'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

interface ResultData {
  correctCount: number;
  totalCount: number;
  correctRate: number;
}

export default function ResultsPage() {
  const { sessionId, reset, isCompleted } = useQuiz();
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
      return;
    }

    // If not completed (e.g. accessed directly), redirect to quiz
    if (!isCompleted) {
      router.replace('/quiz');
      return;
    }

    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/result`);
        if (!response.ok) {
          throw new Error('結果の取得に失敗しました');
        }
        const { data } = await response.json();
        setResult(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '予期せぬエラーが発生しました'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [sessionId, isCompleted, router]);

  const handleRetry = () => {
    reset();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner message="結果を集計中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorMessage message={error} />
        <div className="mt-4 text-center">
          <button
            onClick={handleRetry}
            className="text-primary hover:underline"
          >
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ResultsDisplay
        correctCount={result.correctCount}
        totalCount={result.totalCount}
        correctRate={result.correctRate}
        onRetry={handleRetry}
      />
    </div>
  );
}
