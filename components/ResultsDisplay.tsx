import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trophy, RefreshCw, CheckCircle, XCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface ResultsDisplayProps {
  correctCount: number;
  totalCount: number;
  correctRate: number;
  onRetry: () => void;
}

export function ResultsDisplay({
  correctCount,
  totalCount,
  correctRate,
  onRetry,
}: ResultsDisplayProps) {
  let message = '';
  let colorClass = '';

  if (correctRate >= 80) {
    message = '素晴らしい！大変よくできました！';
    colorClass = 'text-green-600';
  } else if (correctRate >= 60) {
    message = 'その調子！合格点です！';
    colorClass = 'text-blue-600';
  } else {
    message = '惜しい！もう一度復習してみましょう。';
    colorClass = 'text-orange-600';
  }

  return (
    <Card className="w-full max-w-2xl mx-auto text-center shadow-xl border-t-4 border-t-primary">
      <CardHeader className="pb-2">
        <div className="mx-auto bg-gradient-to-br from-yellow-100 to-amber-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-inner">
          <Trophy className="w-12 h-12 text-amber-600" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">
          学習結果
        </CardTitle>
        <p className={`text-xl font-medium mt-4 ${colorClass}`}>{message}</p>
      </CardHeader>

      <CardContent className="space-y-8 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-7xl font-extrabold text-foreground tracking-tighter">
            {correctRate}
            <span className="text-3xl text-muted-foreground ml-1 font-normal">
              %
            </span>
          </div>
          <p className="text-muted-foreground mt-2">正答率</p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
          <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 flex flex-col items-center shadow-sm">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">正解</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-green-800">
                {correctCount}
              </span>
              <span className="text-sm text-green-600">問</span>
            </div>
          </div>

          <div className="bg-red-50/50 p-6 rounded-xl border border-red-100 flex flex-col items-center shadow-sm">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">不正解</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-red-800">
                {totalCount - correctCount}
              </span>
              <span className="text-sm text-red-600">問</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
        <Button onClick={onRetry} size="lg" className="w-full sm:w-auto gap-2">
          <RefreshCw className="w-4 h-4" />
          別の記事で試す
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="w-full sm:w-auto gap-2"
        >
          <Link href="/">
            <Home className="w-4 h-4" />
            ホームに戻る
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
