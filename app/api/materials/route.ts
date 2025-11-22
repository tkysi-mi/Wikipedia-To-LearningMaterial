import { NextRequest, NextResponse } from 'next/server';
import { validateWikipediaUrl } from '@/lib/wikipedia/validateUrl';
import { fetchArticle } from '@/lib/wikipedia/client';
import { generateSummary } from '@/lib/openai/generateSummary';
import { generateQuestions } from '@/lib/openai/generateQuestions';
import { sessionStore } from '@/lib/session/sessionStore';
import type { LearningMaterial } from '@/types/learning-material';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wikipediaUrl } = body;

    // 1. URL検証
    const validationResult = validateWikipediaUrl(wikipediaUrl);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_URL', message: validationResult.error } },
        { status: 400 }
      );
    }

    const { lang, title } = validationResult.data;

    // 2. Wikipedia記事取得
    const articleResult = await fetchArticle(title, lang);
    if (!articleResult.success) {
      return NextResponse.json(
        { error: { code: 'FETCH_ERROR', message: articleResult.error } },
        { status: 500 } // または404
      );
    }

    const { title: articleTitle, text: articleText } = articleResult.data;

    // 3. サマリ生成
    const summaryResult = await generateSummary(articleText);
    if (!summaryResult.success) {
      return NextResponse.json(
        { error: { code: 'GENERATION_ERROR', message: summaryResult.error } },
        { status: 500 }
      );
    }

    // 4. ○×問題生成
    const questionsResult = await generateQuestions(articleText);
    if (!questionsResult.success) {
      return NextResponse.json(
        { error: { code: 'GENERATION_ERROR', message: questionsResult.error } },
        { status: 500 }
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
    console.error('Material Generation Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '教材の生成中にエラーが発生しました' } },
      { status: 500 }
    );
  }
}
