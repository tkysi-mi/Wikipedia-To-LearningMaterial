import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '@/lib/session/sessionStore';
import { handleApiError, AppError } from '@/lib/utils/errorHandlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { materialId } = body;

    if (!materialId) {
      throw new AppError('INVALID_REQUEST', 'Material ID is required', 400);
    }

    try {
      const session = sessionStore.createSession(materialId);
      return NextResponse.json(
        {
          data: {
            sessionId: session.sessionId,
            questions: session.questions,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      // Material not found error
      if (error instanceof Error && error.message === 'Material not found') {
        throw new AppError('MATERIAL_NOT_FOUND', '教材が見つかりません', 404);
      }
      throw error;
    }
  } catch (error) {
    return handleApiError(error);
  }
}
