import type { LearningSession, Answer, SessionResult } from '@/types/learning-session';
import type { LearningMaterial } from '@/types/learning-material';
import { randomUUID } from 'crypto';

// インメモリセッションストア
// 注意: サーバーレス環境(Vercelなど)ではインスタンス間で共有されないため、
// 本番環境ではRedisやDBを使用する必要があります。
// 今回は要件によりインメモリで実装します。
const sessions = new Map<string, LearningSession>();

// 教材データの仮保存用（本来はDBに保存すべき）
const materials = new Map<string, LearningMaterial>();

export const sessionStore = {
  /**
   * 教材を保存する（セッション作成用）
   */
  saveMaterial(material: LearningMaterial): void {
    materials.set(material.id, material);
  },

  /**
   * 教材を取得する
   */
  getMaterial(materialId: string): LearningMaterial | undefined {
    return materials.get(materialId);
  },

  /**
   * 新しいセッションを作成する
   */
  createSession(materialId: string): LearningSession {
    const material = materials.get(materialId);
    if (!material) {
      throw new Error('Material not found');
    }

    const session: LearningSession = {
      sessionId: randomUUID(),
      questions: material.questions,
      currentQuestionNumber: 1,
      answerHistory: [],
      correctCount: 0,
      status: 'in_progress',
      startedAt: new Date(),
      completedAt: null,
    };

    sessions.set(session.sessionId, session);
    return session;
  },

  /**
   * セッションを取得する
   */
  getSession(sessionId: string): LearningSession | undefined {
    return sessions.get(sessionId);
  },

  /**
   * 回答を記録する
   */
  submitAnswer(sessionId: string, answer: Answer): LearningSession {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // 既に回答済みの問題かチェック
    const existingAnswer = session.answerHistory.find(a => a.questionId === answer.questionId);
    if (existingAnswer) {
      return session; // 既に回答済みなら何もしない（あるいはエラー）
    }

    session.answerHistory.push(answer);
    
    if (answer.isCorrect) {
      session.correctCount++;
    }

    // 次の問題へ進むか、完了するか
    if (session.answerHistory.length >= session.questions.length) {
      session.status = 'completed';
      session.completedAt = new Date();
    } else {
      session.currentQuestionNumber++;
    }

    return session;
  },

  /**
   * 結果を計算する
   */
  calculateResult(sessionId: string): SessionResult {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const correctCount = session.correctCount;
    const incorrectCount = session.answerHistory.length - correctCount;
    const correctRate = session.answerHistory.length > 0 
      ? Math.round((correctCount / session.answerHistory.length) * 100) 
      : 0;

    return {
      correctCount,
      incorrectCount,
      correctRate,
      answerHistory: session.answerHistory,
    };
  }
};
