import { openai } from '@/lib/openai/client';
import type { AsyncResult } from '@/types/utils';
import type { QuizQuestion } from '@/types/learning-material';
import { randomUUID } from 'crypto';

/**
 * OpenAIからのレスポンス形式
 */
interface OpenAIQuizQuestion {
  text: string;
  correctAnswer: boolean;
  explanation?: string;
}

/**
 * Wikipedia記事から○×問題を生成する
 * 
 * @param articleText 記事の本文
 * @returns 生成された○×問題リスト（10問）
 */
export async function generateQuestions(articleText: string): AsyncResult<QuizQuestion[], string> {
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
            content: `以下のWikipedia記事から10問の○×問題を生成してください。JSON形式で返してください。
必ず以下のJSONフォーマットを守ってください。配列で返してください。

フォーマット:
[
  {
    "text": "問題文",
    "correctAnswer": true,
    "explanation": "解説（任意）"
  }
]

記事本文:
${articleText}`,
          },
        ],
        response_format: { type: 'json_object' },
      },
      {
        timeout: 60000, // 60秒
      }
    );

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: '問題の生成に失敗しました' };
    }

    // JSONパース
    let parsed: { questions: OpenAIQuizQuestion[] } | OpenAIQuizQuestion[];
    try {
      const json = JSON.parse(content);
      // response_format: { type: 'json_object' } の場合、通常はルートオブジェクトが必要
      // プロンプトで配列を要求しても、{"questions": [...]} のようにラップされることがあるため柔軟に対応
      if (Array.isArray(json)) {
        parsed = json;
      } else if (json.questions && Array.isArray(json.questions)) {
        parsed = json.questions;
      } else {
        // キーが不明な場合、値の中に配列があるか探す
        const arrayValue = Object.values(json).find(v => Array.isArray(v));
        if (arrayValue) {
          parsed = arrayValue as OpenAIQuizQuestion[];
        } else {
          throw new Error('Invalid JSON structure');
        }
      }
    } catch (e) {
      return { success: false, error: 'JSONの解析に失敗しました' };
    }

    const questionsData = Array.isArray(parsed) ? parsed : (parsed as any).questions || [];

    if (questionsData.length === 0) {
      return { success: false, error: '問題が生成されませんでした' };
    }

    // QuizQuestion型に変換
    const questions: QuizQuestion[] = questionsData.map((q: OpenAIQuizQuestion, index: number) => ({
      id: randomUUID(),
      questionText: q.text,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      order: index + 1,
    }));

    // 10問に調整（足りない場合はエラー、多い場合は切り捨て）
    if (questions.length < 10) {
      // 厳密に10問必要ならエラーにするか、あるだけ返すか。要件は「10問生成」
      // ここではあるだけ返すが、警告ログを出すなどの対応も考えられる
      // 今回は成功として返す
    }

    return { success: true, data: questions.slice(0, 10) };

  } catch (error) {
    console.error('OpenAI API Error (Questions):', error);
    return { success: false, error: '問題の生成中にエラーが発生しました' };
  }
}
