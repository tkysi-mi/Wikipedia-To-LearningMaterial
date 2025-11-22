'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import type { LearningMaterial } from '@/types/learning-material';

interface UrlInputFormProps {
  onMaterialGenerated: (material: LearningMaterial) => void;
}

export function UrlInputForm({ onMaterialGenerated }: UrlInputFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wikipediaUrl: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || '教材の生成に失敗しました');
      }

      onMaterialGenerated(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <LoadingSpinner message="AIがWikipedia記事を読み込み、教材を生成しています...（これには最大1分ほどかかる場合があります）" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>教材の生成</CardTitle>
        <CardDescription>
          学習したいWikipedia記事のURLを入力してください。
          <br />
          AIが自動的にサマリと○×問題を作成します。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Wikipedia URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://ja.wikipedia.org/wiki/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              ※ 日本語または英語のWikipedia記事に対応しています
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <Button type="submit" className="w-full" disabled={!url || isLoading}>
            教材を生成する
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
