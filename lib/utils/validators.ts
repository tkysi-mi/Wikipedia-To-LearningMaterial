import { z } from 'zod';

export const urlSchema = z
  .string()
  .url({ message: '有効なURLを入力してください' })
  .refine(
    (url) => {
      return url.includes('wikipedia.org');
    },
    {
      message: 'WikipediaのURLを入力してください',
    }
  );

export const passwordSchema = z.string().min(1, 'パスワードを入力してください');

export function validateUrl(url: string): { success: boolean; error?: string } {
  const result = urlSchema.safeParse(url);
  if (!result.success) {
    const errorMessage =
      result.error?.issues?.[0]?.message || 'バリデーションエラー';
    return {
      success: false,
      error: errorMessage,
    };
  }
  return { success: true };
}

export function validatePassword(password: string): {
  success: boolean;
  error?: string;
} {
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    const errorMessage =
      result.error?.issues?.[0]?.message || 'バリデーションエラー';
    return {
      success: false,
      error: errorMessage,
    };
  }
  return { success: true };
}
