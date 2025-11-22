/**
 * 認証コンテキストの型定義
 * 
 * Bounded Context: Authentication
 * 
 * 責務:
 * - ベーシック認証によるアクセス制御
 * - 認証セッションの状態管理
 */

/**
 * 認証セッション
 * 
 * ライフサイクル:
 * - 作成: ログイン成功時
 * - 更新: なし(イミュータブル)
 * - 削除: ログアウト時、有効期限切れ時
 */
export interface AuthSession {
  /** セッションID (UUID v4) */
  sessionId: string;
  
  /** 認証状態 (true: 認証済み, false: 未認証) */
  authenticated: boolean;
  
  /** セッション作成日時 */
  createdAt: Date;
  
  /** セッション有効期限 */
  expiresAt: Date;
}

/**
 * 認証リクエスト
 */
export interface AuthRequest {
  /** ユーザーが入力したパスワード */
  inputPassword: string;
}

/**
 * 認証レスポンス
 */
export interface AuthResponse {
  /** 認証成功フラグ */
  success: boolean;
  
  /** エラーメッセージ（認証失敗時） */
  message?: string;
}

/**
 * 認証セッションのメソッド（型定義）
 */
export interface AuthSessionMethods {
  /**
   * パスワード検証
   * @param inputPassword ユーザー入力パスワード
   * @returns 認証成功: true, 失敗: false
   */
  authenticate(inputPassword: string): boolean;
  
  /**
   * セッション有効性確認
   * @returns 有効: true, 無効: false
   */
  isValid(): boolean;
}
