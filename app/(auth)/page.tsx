'use client';

import { useState } from 'react';
import { UrlInputForm } from '@/components/UrlInputForm';
import { SummaryDisplay } from '@/components/SummaryDisplay';
import type { LearningMaterial } from '@/types/learning-material';

export default function HomePage() {
  const [material, setMaterial] = useState<LearningMaterial | null>(null);

  const handleMaterialGenerated = (generatedMaterial: LearningMaterial) => {
    setMaterial(generatedMaterial);
  };

  const handleReset = () => {
    setMaterial(null);
  };

  const handleStartSession = () => {
    // Phase 5で実装: セッション開始処理
    console.log('Start session with material:', material?.id);
    alert('学習セッション機能は次のフェーズで実装されます');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Wikipedia学習教材生成</h2>
        <p className="mt-2 text-gray-600">
          WikipediaのURLを入力して、学習教材を生成します
        </p>
      </div>
      
      {!material ? (
        <UrlInputForm onMaterialGenerated={handleMaterialGenerated} />
      ) : (
        <SummaryDisplay 
          material={material} 
          onReset={handleReset} 
          onStartSession={handleStartSession} 
        />
      )}
    </div>
  );
}
