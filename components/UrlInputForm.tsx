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
      <Card className="w-full max-w-2xl border-none shadow-lg ring-1 ring-black/5 overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6 pt-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2">
            <LinkIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              学習を開始
            </h3>
            <p className="text-sm text-muted-foreground">
              WikipediaのURLを入力してください
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="url"
                className="text-sm font-medium text-foreground/80"
              >
                Wikipedia記事のURL
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://ja.wikipedia.org/wiki/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="h-12 px-4 text-base transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="h-12 w-full text-base font-medium transition-all hover:translate-y-[-1px] hover:shadow-md"
              disabled={isLoading}
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
