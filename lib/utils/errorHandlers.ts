import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ErrorCode =
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'MATERIAL_NOT_FOUND'
  | 'SESSION_NOT_FOUND'
  | 'QUESTION_NOT_FOUND';

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Validation Error',
          details: error.issues,
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    // Handle specific known errors if necessary
    if (error.message === 'Material not found') {
      return NextResponse.json(
        {
          error: {
            code: 'MATERIAL_NOT_FOUND',
            message: '教材が見つかりません',
          },
        },
        { status: 404 }
      );
    }
  }

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: '予期せぬエラーが発生しました',
      },
    },
    { status: 500 }
  );
}
