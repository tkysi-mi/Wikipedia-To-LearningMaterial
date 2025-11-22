/**
 * ベーシック認証ロジック
 * 
 * 責務:
 * - パスワード検証
 * - セッション作成・管理
 * - セッション検証
 */

import { randomUUID } from 'crypto';
import type { AuthSession } from '@/types/auth';

/**
 * インメモリセッションストア
 * サーバー再起動で消失する(仕様)
 */
const sessionStore = new Map<string, AuthSession>();

/**
 * セッションの有効期限(24時間)
 */
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * パスワード検証
 * 
 * @param inputPassword - 入力されたパスワード
 * @returns 正しいパスワード: true, 誤ったパスワード: false
 */
export function verifyPassword(inputPassword: string): boolean {
  const correctPassword = process.env.AUTH_PASSWORD;
  
  if (!correctPassword) {
    throw new Error('AUTH_PASSWORD environment variable is not set');
  }
  
  return inputPassword === correctPassword;
}

/**
 * セッション作成
 * 
 * @returns 作成されたセッション
 */
export function createSession(): AuthSession {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);
  
  const session: AuthSession = {
    sessionId,
    authenticated: true,
    createdAt: new Date(),
    expiresAt,
  };
  
  sessionStore.set(sessionId, session);
  
  return session;
}

/**
 * セッション検証
 * 
 * @param sessionId - セッションID
 * @returns 有効なセッション: AuthSession, 無効: null
 */
export function validateSession(sessionId: string): AuthSession | null {
  const session = sessionStore.get(sessionId);
  
  if (!session) {
    return null;
  }
  
  // 有効期限チェック
  if (session.expiresAt < new Date()) {
    sessionStore.delete(sessionId);
    return null;
  }
  
  return session;
}

/**
 * セッション削除
 * 
 * @param sessionId - セッションID
 */
export function deleteSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}
