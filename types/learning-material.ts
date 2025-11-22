/**
 * 教材生成コンテキストの型定義
 * 
 * Bounded Context: Learning Material Generation
 * 
 * 責務:
 * - Wikipedia記事を解析し、AIを使用してサマリと○×問題を自動生成
 */

import type { QuizChoice } from './common';

/**
 * ○×問題
 * 
 * ライフサイクル:
 * - 作成: LearningMaterial生成時に10問一括生成
 * - 更新: なし（イミュータブル）
 * - 削除: LearningMaterial削除時
 */
export interface QuizQuestion {
  /** 問題ID（UUID v4） */
  id: string;
  
  /** 問題文（最小10文字、最大500文字） */
  questionText: string;
  
  /** 正解（true: ○, false: ×） */
  correctAnswer: QuizChoice;
  
  /** 解説（オプション、将来拡張用） */
  explanation?: string;
  
  /** 問題番号（1-10） */
  order: number;
}

/**
 * 教材
 * 
 * ライフサイクル:
 * - 作成: URL入力画面でURL送信時
 * - 更新: サマリ・問題生成完了時
 * - 削除: 新しい教材生成時（前回データ破棄）
 */
export interface LearningMaterial {
  /** 教材ID（UUID v4） */
  id: string;
  
  /** Wikipedia記事URL（形式: https://ja.wikipedia.org/wiki/...） */
  wikipediaUrl: string;
  
  /** 記事タイトル（Wikipedia APIから取得） */
  articleTitle: string;
  
  /** 記事本文（Wikipedia APIから取得、最小100文字） */
  articleText: string;
  
  /** AI生成サマリ（3行程度、約100-200文字） */
  summary: string;
  
  /** ○×問題リスト（必ず10問） */
  questions: QuizQuestion[];
  
  /** 生成日時 */
  createdAt: Date;
}

/**
 * サマリ生成リクエスト
 */
export interface GenerateSummaryRequest {
  /** Wikipedia記事URL */
  wikipediaUrl: string;
}

/**
 * サマリ生成レスポンス
 */
export interface GenerateSummaryResponse {
  /** 記事タイトル */
  articleTitle: string;
  
  /** AI生成サマリ */
  summary: string;
  
  /** 記事本文（問題生成に使用） */
  articleText: string;
}

/**
 * 問題生成リクエスト
 */
export interface GenerateQuestionsRequest {
  /** 記事本文 */
  articleText: string;
  
  /** 記事タイトル */
  articleTitle: string;
}

/**
 * 問題生成レスポンス
 */
export interface GenerateQuestionsResponse {
  /** ○×問題リスト（10問） */
  questions: QuizQuestion[];
}

/**
 * 教材生成のメソッド（型定義）
 */
export interface LearningMaterialMethods {
  /**
   * OpenAI APIでサマリ生成
   * @returns 生成されたサマリ
   */
  generateSummary(): Promise<string>;
  
  /**
   * OpenAI APIで問題生成
   * @returns 生成された○×問題リスト（10問）
   */
  generateQuestions(): Promise<QuizQuestion[]>;
  
  /**
   * 教材生成完了確認
   * @returns 完了: true, 未完了: false
   */
  isReady(): boolean;
}

/**
 * 問題のバリデーション（型定義）
 */
export interface QuizQuestionMethods {
  /**
   * 問題データの妥当性確認
   * @returns 妥当: true, 不正: false
   */
  validate(): boolean;
}
