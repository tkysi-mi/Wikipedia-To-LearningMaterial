/**
 * 共通型定義
 *
 * 目的:
 * - 列挙型やユーティリティ型など、複数のコンテキストで使用される共通型を定義
 * - 型の再利用性を高め、一貫性を保つ
 */

/**
 * ○×問題の選択肢
 * true: ○（正しい）
 * false: ×（誤り）
 */
export type QuizChoice = boolean;

/**
 * 学習セッションの状態
 */
export type SessionStatus = 'not_started' | 'in_progress' | 'completed';

/**
 * API呼び出しの状態
 */
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * 成功レスポンス（ジェネリック）
 */
export interface SuccessResponse<T> {
  data: T;
  message?: string;
}
