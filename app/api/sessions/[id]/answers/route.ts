import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '@/lib/session/sessionStore';
import { randomUUID } from 'crypto';
import type { Answer } from '@/types/learning-session';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const body = await req.json();
    const { questionId, userAnswer } = body;

    if (!sessionId || !questionId || userAnswer === undefined) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Invalid request parameters' } },
        { status: 400 }
      );
    }

    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Session not found' } },
        { status: 404 }
      );
    }

    const question = session.questions.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Question not found' } },
        { status: 404 }
      );
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

    // 次の問題があるか確認
    const nextQuestion = session.questions.find(q => q.order === question.order + 1);
    const hasNextQuestion = !!nextQuestion;

    return NextResponse.json({
      data: {
        answer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        hasNextQuestion,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Answer Submission Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '回答の送信中にエラーが発生しました' } },
      { status: 500 }
    );
  }
}
