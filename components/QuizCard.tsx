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
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-3">
        <div className="flex justify-between items-end text-sm font-medium text-muted-foreground">
          <span className="bg-muted/50 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            Question {currentNumber} / {totalNumber}
          </span>
          <span className="text-primary font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2.5 bg-muted/50" />
      </div>

      <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-muted/30 pb-8 pt-8 border-b border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-full ring-2 ring-background">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              ○×クイズ
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold leading-relaxed text-foreground/90">
            {question.questionText}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-10 space-y-8">
          {!hasAnswered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Button
                onClick={() => onAnswer(true)}
                variant="outline"
                className="h-40 flex flex-col gap-4 border-2 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all text-xl group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-14 w-14 rounded-full border-2 border-current flex items-center justify-center text-3xl font-bold bg-background z-10 group-hover:scale-110 transition-transform">
                  ○
                </div>
                <span className="font-bold z-10">正しい</span>
              </Button>
              <Button
                onClick={() => onAnswer(false)}
                variant="outline"
                className="h-40 flex flex-col gap-4 border-2 hover:border-destructive hover:bg-destructive/5 hover:text-destructive transition-all text-xl group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-14 w-14 rounded-full border-2 border-current flex items-center justify-center text-3xl font-bold bg-background z-10 group-hover:scale-110 transition-transform">
                  ×
                </div>
                <span className="font-bold z-10">誤り</span>
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                'rounded-2xl p-8 border animate-in fade-in slide-in-from-bottom-2 shadow-sm',
                feedback.isCorrect
                  ? 'bg-green-50/50 border-green-200'
                  : 'bg-red-50/50 border-red-200'
              )}
            >
              <div className="flex items-start gap-5">
                {feedback.isCorrect ? (
                  <div className="p-2 bg-green-100 rounded-full shrink-0">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-100 rounded-full shrink-0">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                )}
                <div className="space-y-3 w-full">
                  <h3
                    className={cn(
                      'text-2xl font-bold tracking-tight',
                      feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                    )}
                  >
                    {feedback.isCorrect ? '正解です！' : '不正解...'}
                  </h3>
                  <p className="text-foreground/80 text-lg">
                    正解は
                    <span
                      className={cn(
                        'font-bold mx-2 px-2 py-0.5 rounded',
                        feedback.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      )}
                    >
                      {feedback.correctAnswer ? '○ 正しい' : '× 誤り'}
                    </span>
                    です。
                  </p>

                  {question.explanation && (
                    <div className="mt-6 pt-6 border-t border-black/5">
                      <div className="flex items-center gap-2 font-bold text-foreground mb-3">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        解説
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-lg">
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
          <CardFooter className="bg-muted/30 p-6 sm:p-8 flex justify-end border-t border-border/50">
            <Button
              onClick={onNext}
              size="lg"
              className="gap-2 pl-8 pr-6 h-14 text-lg font-semibold shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all"
            >
              {currentNumber === totalNumber ? '結果を見る' : '次の問題へ'}
              <ArrowRight className="h-6 w-6" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
