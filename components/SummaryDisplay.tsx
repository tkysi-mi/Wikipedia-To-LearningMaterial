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
    <div className="w-full max-w-3xl mx-auto space-y-10 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/5 text-primary rounded-full mb-2 ring-1 ring-primary/10">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            教材の生成が完了しました
          </h2>
          <p className="text-muted-foreground text-lg">
            「
            <span className="font-semibold text-foreground">
              {material.articleTitle}
            </span>
            」の学習準備が整いました
          </p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              AI要約
            </span>
          </div>
          <CardTitle className="text-2xl font-bold leading-tight">
            {material.articleTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-10">
          <div className="prose prose-slate prose-lg max-w-none">
            <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
              {material.summary}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 px-5 py-2.5 rounded-full border border-border/50">
          <span className="flex h-2 w-2 rounded-full bg-primary"></span>
          <span>
            <span className="font-bold text-foreground text-base mr-1">
              {material.questions.length}
            </span>
            問のクイズを作成済み
          </span>
        </div>
        <div className="flex w-full sm:w-auto gap-4">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
            className="flex-1 sm:flex-none h-12 px-6 text-base hover:bg-muted/50"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            他の記事で試す
          </Button>
          <Button
            onClick={onStartSession}
            disabled={isLoading}
            className="flex-1 sm:flex-none min-w-[160px] h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:translate-y-[-1px] transition-all"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                <BookOpen className="mr-2 h-5 w-5" />
                クイズを開始
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
