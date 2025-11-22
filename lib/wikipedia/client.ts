import type { AsyncResult } from '@/types/utils';

export interface WikipediaArticle {
  title: string;
  text: string;
}

/**
 * Wikipedia APIから記事を取得する
 * 
 * @param articleTitle 記事タイトル
 * @param lang 言語コード ('ja' | 'en')
 * @returns 記事情報（タイトルと本文）
 */
export async function fetchArticle(
  articleTitle: string,
  lang: 'ja' | 'en' = 'ja'
): AsyncResult<WikipediaArticle, string> {
  try {
    const endpoint = `https://${lang}.wikipedia.org/w/api.php`;
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'extracts',
      explaintext: 'true',
      titles: articleTitle,
      origin: '*', // CORS対応
    });

    const response = await fetch(`${endpoint}?${params.toString()}`);

    if (!response.ok) {
      return { success: false, error: `Wikipedia API request failed: ${response.statusText}` };
    }

    const data = await response.json();
    const pages = data.query?.pages;

    if (!pages) {
      return { success: false, error: 'Wikipedia API response invalid' };
    }

    const pageId = Object.keys(pages)[0];
    if (!pageId || pageId === '-1') {
      return { success: false, error: '記事が見つかりませんでした' };
    }

    const page = pages[pageId];
    return {
      success: true,
      data: {
        title: page.title,
        text: page.extract,
      },
    };
  } catch (error) {
    console.error('Wikipedia API Error:', error);
    return { success: false, error: 'Wikipedia APIへの接続に失敗しました' };
  }
}
