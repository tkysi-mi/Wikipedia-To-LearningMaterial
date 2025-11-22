/**
 * 認証ミドルウェア
 * 
 * 責務:
 * - API Routesの認証チェック
 * - 未認証リクエストの拒否
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from './basicAuth';

/**
 * 認証チェックミドルウェア
 * 
 * @param handler - 保護するハンドラー関数
 * @returns ラップされたハンドラー関数
 */
export function withAuth<T>(
  handler: (req: NextRequest) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest): Promise<NextResponse<T>> => {
    // CookieからセッションIDを取得
    const sessionId = req.cookies.get('session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: '認証が必要です' } },
        { status: 401 }
      ) as NextResponse<T>;
    }
    
    // セッション検証
    const session = validateSession(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'セッションが無効です' } },
        { status: 401 }
      ) as NextResponse<T>;
    }
    
    // 認証成功、ハンドラーを実行
    return handler(req);
  };
}
