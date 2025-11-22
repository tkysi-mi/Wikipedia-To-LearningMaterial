import { openai } from '@/lib/openai/client';
import type { AsyncResult } from '@/types/utils';

/**
 * Wikipedia記事を要約する
 * 
 * @param articleText 記事の本文
 * @returns 要約されたテキスト
 */
export async function generateSummary(articleText: string): AsyncResult<string, string> {
  if (!articleText) {
    return { success: false, error: '記事本文が空です' };
  }

  try {
    const response = await openai.chat.completions.create(
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `以下のWikipedia記事を3行で要約してください。各行は簡潔に。\n\n${articleText}`,
          },
        ],
      },
      {
        timeout: 60000, // 60秒
      }
    );

    const summary = response.choices[0]?.message?.content;

    if (!summary) {
      return { success: false, error: '要約の生成に失敗しました' };
    }

    return { success: true, data: summary };
  } catch (error) {
    console.error('OpenAI API Error (Summary):', error);
    return { success: false, error: '要約の生成中にエラーが発生しました' };
  }
}
