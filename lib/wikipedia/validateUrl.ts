import type { Result } from '@/types/utils';

/**
 * 検証済みのWikipedia記事情報
 */
export interface WikipediaArticleInfo {
  lang: 'ja' | 'en';
  title: string;
}

/**
 * Wikipedia URLを検証し、言語コードと記事タイトルを抽出する
 *
 * @param url 検証するURL
 * @returns 検証結果（成功時は言語コードと記事タイトル、失敗時はエラーメッセージ）
 */
export function validateWikipediaUrl(
  url: string
): Result<WikipediaArticleInfo, string> {
  if (!url) {
    return { success: false, error: 'URLを入力してください' };
  }

  try {
    // URLオブジェクトを作成して解析
    const urlObj = new URL(url);

    // プロトコルの検証
    if (urlObj.protocol !== 'https:') {
      return { success: false, error: 'HTTPS形式のURLを入力してください' };
    }

    // ホスト名の検証 (ja.wikipedia.org または en.wikipedia.org)
    const hostRegex = /^(ja|en)\.wikipedia\.org$/;
    const match = urlObj.hostname.match(hostRegex);

    if (!match) {
      return {
        success: false,
        error: '日本語または英語のWikipedia URLを入力してください',
      };
    }

    const lang = match[1] as 'ja' | 'en';

    // パスの検証 (/wiki/記事タイトル)
    // URLオブジェクトのpathnameはデコードされていない状態
    const pathRegex = /^\/wiki\/(.+)$/;
    const pathMatch = urlObj.pathname.match(pathRegex);

    if (!pathMatch || !pathMatch[1]) {
      return { success: false, error: '記事ページのURLを入力してください' };
    }

    // タイトルをデコード
    const title = decodeURIComponent(pathMatch[1]);

    if (!title.trim()) {
      return { success: false, error: '記事タイトルが無効です' };
    }

    return { success: true, data: { lang, title } };
  } catch {
    return { success: false, error: '無効なURL形式です' };
  }
}
