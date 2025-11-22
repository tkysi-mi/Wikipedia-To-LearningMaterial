import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, RotateCcw } from 'lucide-react';
import type { LearningMaterial } from '@/types/learning-material';

interface SummaryDisplayProps {
  material: LearningMaterial;
  onReset: () => void;
  onStartSession: () => void;
}

export function SummaryDisplay({ material, onReset, onStartSession }: SummaryDisplayProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            教材が生成されました
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{material.articleTitle}</h3>
            <div className="bg-muted p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap">
              {material.summary}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{material.questions.length}問</span>の○×問題が作成されました
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                別の記事で試す
              </Button>
              <Button onClick={onStartSession}>
                <BookOpen className="mr-2 h-4 w-4" />
                問題を開始する
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
