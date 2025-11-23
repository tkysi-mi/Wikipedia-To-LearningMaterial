import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { QuizQuestion } from '@/types/learning-material';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  question: QuizQuestion;
  currentNumber: number;
  totalNumber: number;
  onAnswer: (answer: boolean) => void;
  onNext: () => void;
  feedback: {
    isCorrect: boolean;
    correctAnswer: boolean;
  } | null;
}

export function QuizCard({
  question,
  currentNumber,
  totalNumber,
  onAnswer,
  onNext,
  feedback,
}: QuizCardProps) {
  const hasAnswered = feedback !== null;
  const progress = (currentNumber / totalNumber) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>
            第 {currentNumber} 問 / 全 {totalNumber} 問
          </span>
          <span>{Math.round(progress)}% 完了</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-none shadow-lg ring-1 ring-black/5 overflow-hidden">
        <CardHeader className="bg-muted/30 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              ○×クイズ
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-medium leading-relaxed">
            {question.questionText}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {!hasAnswered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => onAnswer(true)}
                variant="outline"
                className="h-32 flex flex-col gap-3 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all text-lg"
              >
                <div className="h-12 w-12 rounded-full border-2 border-current flex items-center justify-center text-2xl font-bold">
                  ○
                </div>
                <span>○ 正しい</span>
              </Button>
              <Button
                onClick={() => onAnswer(false)}
                variant="outline"
                className="h-32 flex flex-col gap-3 hover:border-destructive hover:bg-destructive/5 hover:text-destructive transition-all text-lg"
              >
                <div className="h-12 w-12 rounded-full border-2 border-current flex items-center justify-center text-2xl font-bold">
                  ×
                </div>
                <span>× 誤り</span>
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                'rounded-xl p-6 border-2 animate-in fade-in slide-in-from-bottom-2',
                feedback.isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              )}
            >
              <div className="flex items-start gap-4">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600 shrink-0" />
                )}
                <div className="space-y-2">
                  <h3
                    className={cn(
                      'text-xl font-bold',
                      feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                    )}
                  >
                    {feedback.isCorrect ? '正解！' : '不正解...'}
                  </h3>
                  <p className="text-foreground/80">
                    正解は{' '}
                    <span className="font-bold">
                      {feedback.correctAnswer ? '「○ 正しい」' : '「× 誤り」'}
                    </span>{' '}
                    です。
                  </p>

                  {question.explanation && (
                    <div className="mt-4 pt-4 border-t border-black/5">
                      <div className="flex items-center gap-2 font-semibold text-foreground mb-2">
                        <AlertCircle className="h-4 w-4" />
                        解説
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {hasAnswered && (
          <CardFooter className="bg-muted/30 p-6 flex justify-end">
            <Button
              onClick={onNext}
              size="lg"
              className="gap-2 pl-8 pr-6 text-base shadow-md hover:translate-y-[-1px] transition-all"
            >
              {currentNumber === totalNumber ? '結果を見る' : '次の問題へ'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
