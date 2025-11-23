'use client';

import { useState } from 'react';
import { UrlInputForm } from '@/components/UrlInputForm';
import { SummaryDisplay } from '@/components/SummaryDisplay';
import { useQuiz } from '@/contexts/QuizContext';
import type { LearningMaterial } from '@/types/learning-material';

export default function HomePage() {
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { startSession, isLoading: isSessionLoading } = useQuiz();

  const handleGenerateMaterial = async (url: string) => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wikipediaUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '教材の生成に失敗しました');
      }

      const { data } = await response.json();
      setMaterial(data);
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : '予期せぬエラーが発生しました'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setMaterial(null);
    setGenerationError(null);
  };

  const handleStartSession = async () => {
    if (material) {
      await startSession(material);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {!material && (
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Wikipedia学習教材生成
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Wikipediaの記事をAIが要約し、理解度確認クイズを作成します。<br>効率的な学習体験を始めましょう。
          </p>
        </div>
      )}

      {!material ? (
        <UrlInputForm
          onSubmit={handleGenerateMaterial}
          isLoading={isGenerating}
          error={generationError}
        />
      ) : (
        <SummaryDisplay
          material={material}
          onReset={handleReset}
          onStartSession={handleStartSession}
          isLoading={isSessionLoading}
        />
      )}
    </div>
  );
}
