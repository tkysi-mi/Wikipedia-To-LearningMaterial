/**
 * ログインAPI
 * 
 * POST /api/auth/login
 * パスワード検証とセッション作成
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth/basicAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    
    // パスワード検証
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'パスワードを入力してください' } },
        { status: 400 }
      );
    }
    
    const isValid = verifyPassword(password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: { code: 'INVALID_PASSWORD', message: 'パスワードが間違っています' } },
        { status: 401 }
      );
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'ログインに失敗しました' } },
      { status: 500 }
    );
  }
}
