import { openai } from '@/lib/openai/client';
import type { AsyncResult } from '@/types/utils';

/**
 * Wikipedia記事を要約する
 *
 * @param articleText 記事の本文
 * @returns 要約されたテキスト
 */
export async function generateSummary(
  articleText: string
): AsyncResult<string, string> {
  if (!articleText) {
    return { success: false, error: '記事本文が空です' };
  }

  try {
    const response = await openai.chat.completions.create(
      {
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'user',
            content: `以下のWikipedia記事を詳細に分析し、要約してください。

要件:
1. **最初に、この記事が何についてのものかを説明する一文を出力してください。**
2. **次の行に空行を入れてから、読者にとって興味深いと思われる重要なポイントを3〜5点選び出し、箇条書きで出力してください。**
3. 文体は「です・ます」調とし、日本語として自然で読みやすい文章にしてください。
4. **マークダウンの太字（**...**）などの装飾は絶対に使用しないでください。**
5. **各箇条書きは必ず「一文」で完結させてください。**（複数の文に分けない）
6. **全体の文字数は350文字以内に収めてください。**

記事本文:
${articleText}`,
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
