/**
 * ログインAPI
 *
 * POST /api/auth/login
 * パスワード検証とセッション作成
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth/basicAuth';
import { handleApiError, AppError } from '@/lib/utils/errorHandlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    // パスワード検証
    if (!password || typeof password !== 'string') {
      throw new AppError(
        'INVALID_REQUEST',
        'パスワードを入力してください',
        400
      );
    }

    const isValid = verifyPassword(password);

    if (!isValid) {
      throw new AppError('UNAUTHORIZED', 'パスワードが間違っています', 401);
    }

    // セッション作成
    const session = createSession();

    // HttpOnly CookieにセッションIDを設定
    const response = NextResponse.json(
      { data: { authenticated: true }, message: 'ログインしました' },
      { status: 200 }
    );

    response.cookies.set('session_id', session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24時間
      path: '/',
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
