import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '@/lib/session/sessionStore';
import { randomUUID } from 'crypto';
import type { Answer } from '@/types/learning-session';
import { handleApiError, AppError } from '@/lib/utils/errorHandlers';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const body = await req.json();
    const { questionId, userAnswer } = body;

    if (!sessionId || !questionId || userAnswer === undefined) {
      throw new AppError('INVALID_REQUEST', 'Missing required fields', 400);
    }

    const session = sessionStore.getSession(sessionId);
    if (!session) {
      throw new AppError(
        'SESSION_NOT_FOUND',
        'セッションが見つかりません',
        404
      );
    }

    const question = session.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new AppError('QUESTION_NOT_FOUND', '問題が見つかりません', 404);
    }

    const isCorrect = question.correctAnswer === userAnswer;

    const answer: Answer = {
      answerId: randomUUID(),
      questionId,
      userChoice: userAnswer,
      isCorrect,
      answeredAt: new Date(),
    };

    sessionStore.submitAnswer(sessionId, answer);

    return NextResponse.json({
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation, // Optional, if available
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
