import { NextRequest, NextResponse } from 'next/server';
import { validateWikipediaUrl } from '@/lib/wikipedia/validateUrl';
import { fetchArticle } from '@/lib/wikipedia/client';
import { generateSummary } from '@/lib/openai/generateSummary';
import { generateQuestions } from '@/lib/openai/generateQuestions';
import { sessionStore } from '@/lib/session/sessionStore';
import { randomUUID } from 'crypto';
import type { LearningMaterial } from '@/types/learning-material';
import { handleApiError, AppError } from '@/lib/utils/errorHandlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wikipediaUrl } = body;

    // 1. URL検証
    const validationResult = validateWikipediaUrl(wikipediaUrl);
    if (!validationResult.success) {
      throw new AppError(
        'INVALID_REQUEST',
        validationResult.error || 'Invalid URL',
        400
      );
    }

    const { lang, title } = validationResult.data;

    // 2. Wikipedia記事取得
    const articleResult = await fetchArticle(title, lang);
    if (!articleResult.success) {
      throw new AppError(
        'INTERNAL_ERROR',
        articleResult.error || 'Failed to fetch article',
        500
      );
    }

    const { title: articleTitle, text: articleText } = articleResult.data;

    // 3. サマリ生成と○×問題生成を並列実行
    const [summaryResult, questionsResult] = await Promise.all([
      generateSummary(articleText),
      generateQuestions(articleText),
    ]);

    if (!summaryResult.success) {
      throw new AppError(
        'INTERNAL_ERROR',
        summaryResult.error || 'Failed to generate summary',
        500
      );
    }

    if (!questionsResult.success) {
      throw new AppError(
        'INTERNAL_ERROR',
        questionsResult.error || 'Failed to generate questions',
        500
      );
    }

    // 5. LearningMaterialオブジェクト作成
    const material: LearningMaterial = {
      id: randomUUID(),
      wikipediaUrl,
      articleTitle,
      articleText,
      summary: summaryResult.data,
      questions: questionsResult.data,
      createdAt: new Date(),
    };

    // セッションストアに保存（インメモリ）
    sessionStore.saveMaterial(material);

    return NextResponse.json({ data: material }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
