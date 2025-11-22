/**
 * ログアウトAPI
 * 
 * POST /api/auth/logout
 * セッション削除
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/basicAuth';

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('session_id')?.value;
    
    if (sessionId) {
      deleteSession(sessionId);
    }
    
    // Cookieを削除
    const response = NextResponse.json(
      { data: { authenticated: false }, message: 'ログアウトしました' },
      { status: 200 }
    );
    
    response.cookies.delete('session_id');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'ログアウトに失敗しました' } },
      { status: 500 }
    );
  }
}
