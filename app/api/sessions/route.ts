import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '@/lib/session/sessionStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { materialId } = body;

    if (!materialId) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Material ID is required' } },
        { status: 400 }
      );
    }

    try {
      const session = sessionStore.createSession(materialId);
      return NextResponse.json({ data: { sessionId: session.sessionId } }, { status: 201 });
    } catch (e) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Material not found' } },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Session Creation Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'セッションの作成中にエラーが発生しました' } },
      { status: 500 }
    );
  }
}
