/**
 * ユーティリティ型定義
 * 
 * 汎用的な型定義を提供
 */

/**
 * Result型 - 成功/失敗を表す型
 * 
 * @template T 成功時のデータ型
 * @template E エラー型
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * AsyncResult型 - 非同期版Result型
 * 
 * @template T 成功時のデータ型
 * @template E エラー型
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Optional型 - 値が存在するかどうかを表す型
 * 
 * @template T 値の型
 */
export type Optional<T> = T | null | undefined;

/**
 * NonEmptyArray型 - 空でない配列を表す型
 * 
 * @template T 配列要素の型
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * DeepReadonly型 - ネストされたオブジェクトも含めて読み取り専用にする型
 * 
 * @template T オブジェクトの型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Prettify型 - 型の表示を見やすくする型
 * 
 * @template T 型
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
