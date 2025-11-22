/**
 * 学習セッションコンテキストの型定義
 * 
 * Bounded Context: Learning Session
 * 
 * 責務:
 * - ○×問題の回答管理
 * - 正解/不正解フィードバック
 * - 結果集計
 */

import type { QuizQuestion } from './learning-material';
import type { QuizChoice, SessionStatus } from './common';

/**
 * 個別の回答記録
 * 
 * ライフサイクル:
 * - 作成: ○または×ボタンクリック時
 * - 更新: なし（イミュータブル）
 * - 削除: LearningSession削除時
 */
export interface Answer {
  /** 回答ID（UUID v4） */
  answerId: string;
  
  /** 問題ID（QuizQuestion.id参照） */
  questionId: string;
  
  /** ユーザー回答（true: ○, false: ×） */
  userChoice: QuizChoice;
  
  /** 正解判定（true: 正解, false: 不正解） */
  isCorrect: boolean;
  
  /** 回答日時 */
  answeredAt: Date;
}

/**
 * 学習セッション
 * 
 * ライフサイクル:
 * - 作成: 「問題を開始」ボタンクリック時
 * - 更新: 各問題回答時
 * - 削除: 「別の記事で試す」ボタンクリック時
 */
export interface LearningSession {
  /** セッションID（UUID v4） */
  sessionId: string;
  
  /** 問題リスト（LearningMaterialから取得、10問） */
  questions: QuizQuestion[];
  
  /** 現在の問題番号（1-10） */
  currentQuestionNumber: number;
  
  /** 回答履歴（最大10件） */
  answerHistory: Answer[];
  
  /** 正答数（0-10） */
  correctCount: number;
  
  /** セッション状態 */
  status: SessionStatus;
  
  /** セッション開始日時 */
  startedAt: Date;
  
  /** セッション完了日時（10問目回答時） */
  completedAt: Date | null;
}

/**
 * セッション結果
 */
export interface SessionResult {
  /** 正答数（0-10） */
  correctCount: number;
  
  /** 不正解数（0-10） */
  incorrectCount: number;
  
  /** 正答率（0-100%） */
  correctRate: number;
  
  /** 回答履歴 */
  answerHistory: Answer[];
}

/**
 * 回答送信リクエスト
 */
export interface SubmitAnswerRequest {
  /** セッションID */
  sessionId: string;
  
  /** 問題ID */
  questionId: string;
  
  /** ユーザー回答（true: ○, false: ×） */
  userChoice: QuizChoice;
}

/**
 * 回答送信レスポンス
 */
export interface SubmitAnswerResponse {
  /** 回答記録 */
  answer: Answer;
  
  /** 正解（true: ○, false: ×） */
  correctAnswer: QuizChoice;
  
  /** 解説（オプション） */
  explanation?: string;
  
  /** 次の問題があるか */
  hasNextQuestion: boolean;
}

/**
 * 学習セッションのメソッド（型定義）
 */
export interface LearningSessionMethods {
  /**
   * セッション開始
   */
  startSession(): void;
  
  /**
   * 回答送信
   * @param userChoice ユーザー回答
   * @returns 回答記録
   */
  submitAnswer(userChoice: QuizChoice): Answer;
  
  /**
   * 結果計算
   * @returns セッション結果
   */
  calculateResult(): SessionResult;
  
  /**
   * セッションリセット
   */
  reset(): void;
}

/**
 * 回答のメソッド（型定義）
 */
export interface AnswerMethods {
  /**
   * 正解判定
   * @param correctAnswer 正解
   * @returns 正解: true, 不正解: false
   */
  judge(correctAnswer: QuizChoice): boolean;
}
