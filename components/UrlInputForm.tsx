'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UrlInputFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function UrlInputForm({
  onSubmit,
  isLoading,
  error,
}: UrlInputFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      await onSubmit(url);
    }
  };

  return (
    <div className="flex w-full justify-center px-4">
      <Card className="w-full max-w-2xl border-none shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-muted/30 pb-8 pt-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 ring-4 ring-background">
            <LinkIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              学習を開始
            </h3>
            <p className="text-muted-foreground text-balance max-w-sm mx-auto">
              WikipediaのURLを入力して、AIによる要約とクイズ生成を開始します
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="url"
                className="text-sm font-semibold text-foreground/90"
              >
                Wikipedia記事のURL
              </Label>
              <div className="relative group">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://ja.wikipedia.org/wiki/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="h-14 px-5 text-lg transition-all border-input/50 bg-background/50 focus:bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary group-hover:border-primary/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="animate-fade-in border-destructive/20 bg-destructive/5"
              >
                <AlertTitle className="font-semibold">
                  エラーが発生しました
                </AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="h-14 w-full text-lg font-semibold transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/20 active:translate-y-[0px]"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  教材を生成中...
                </>
              ) : (
                '教材を生成する'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
