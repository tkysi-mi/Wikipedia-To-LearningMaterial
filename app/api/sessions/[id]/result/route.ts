import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '@/lib/session/sessionStore';
import { handleApiError, AppError } from '@/lib/utils/errorHandlers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    if (!sessionId) {
      throw new AppError('INVALID_REQUEST', 'Session ID is required', 400);
    }

    const session = sessionStore.getSession(sessionId);
    if (!session) {
      throw new AppError(
        'SESSION_NOT_FOUND',
        'セッションが見つかりません',
        404
      );
    }

    const result = sessionStore.calculateResult(sessionId);

    return NextResponse.json({
      data: {
        correctCount: result.correctCount,
        totalCount: session.questions.length,
        correctRate: result.correctRate,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
