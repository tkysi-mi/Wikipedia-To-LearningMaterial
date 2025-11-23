import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { LearningMaterial } from '@/types/learning-material';

interface SummaryDisplayProps {
  material: LearningMaterial;
  onReset: () => void;
  onStartSession: () => void;
  isLoading?: boolean;
}

export function SummaryDisplay({
  material,
  onReset,
  onStartSession,
  isLoading = false,
}: SummaryDisplayProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-full mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          教材の生成が完了しました！
        </h2>
        <p className="text-muted-foreground">
          「
          <span className="font-semibold text-foreground">
            {material.articleTitle}
          </span>
          」の学習教材が準備できました。
        </p>
      </div>

      <Card className="border-none shadow-lg ring-1 ring-black/5 overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              要約
            </span>
          </div>
          <CardTitle className="text-2xl">{material.articleTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">
            <div className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {material.summary}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
          <span className="font-semibold text-foreground">
            {material.questions.length}
          </span>{' '}
          問のクイズを作成
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            他の記事で試す
          </Button>
          <Button
            onClick={onStartSession}
            disabled={isLoading}
            className="flex-1 sm:flex-none min-w-[140px]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                クイズを開始
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
