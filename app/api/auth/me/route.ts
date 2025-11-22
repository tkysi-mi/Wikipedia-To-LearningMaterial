/**
 * 認証状態確認API
 * 
 * GET /api/auth/me
 * 現在の認証状態を返す
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/basicAuth';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { data: { authenticated: false } },
        { status: 200 }
      );
    }
    
    const session = validateSession(sessionId);
    
    return NextResponse.json(
      { data: { authenticated: !!session } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '認証状態の確認に失敗しました' } },
      { status: 500 }
    );
  }
}
