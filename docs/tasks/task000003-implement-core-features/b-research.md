# リサーチドキュメント

<!--
このドキュメントについて:
  - 格納場所: docs/tasks/task000003-implement-core-features/b-research.md
  - 作成方法: /b-002-CreateTaskResearch ワークフローで作成
  - 前提条件: a-definition.md が作成済みであること
  - 関連ドキュメント:
    - a-definition.md (タスク定義ドキュメント)
    - c-implementation.md (実装タスクリスト)

このドキュメントの目的:
  - 実装前の技術調査結果を記録
  - ベストプラクティスの収集
  - 既存コードの分析
  - 再利用可能なコンポーネントの特定
  - 技術選定の根拠を明確化

更新タイミング:
  - 実装開始前に調査結果を記録
  - 新たな知見が得られた際に追記
  - 技術選定の変更時に更新
-->

---

## 1. ベストプラクティス

| トピック | ベストプラクティス | 参考リンク |
|---------|-------------------|-----------|
| Next.js App Router | API RoutesでRESTful APIを実装。`route.ts`でHTTPメソッドごとにハンドラーを定義。 | [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) |
| ベーシック認証 | HttpOnly Cookieでセッション管理。環境変数でパスワード管理。HTTPS必須。 | [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) |
| React Context | 最小限のContextを使用。認証状態と学習セッション状態のみ。Provider分離でパフォーマンス最適化。 | [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context) |
| TypeScript型定義 | ドメインモデルに基づいた型定義。`types/`ディレクトリで集約管理。ユビキタス言語を反映。 | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| エラーハンドリング | 統一されたエラーレスポンス形式。適切なHTTPステータスコード使用。ユーザーフレンドリーなメッセージ。 | [RFC 7807 Problem Details](https://tools.ietf.org/html/rfc7807) |
| API設計 | RESTful原則に従う。リソース名は複数形。認証が必要なエンドポイントはミドルウェアで保護。 | [REST API Best Practices](https://restfulapi.net/) |
| React Hook Form | 非制御コンポーネントでパフォーマンス最適化。Zodでバリデーション。型安全性確保。 | [React Hook Form](https://react-hook-form.com/) |
| Tailwind CSS | ユーティリティクラスでレスポンシブデザイン。shadcn/uiで一貫性のあるUIコンポーネント。 | [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles) |

### アンチパターン

- ❌ **パスワードをハードコード**: 環境変数で管理する
- ❌ **APIキーをクライアント側に露出**: サーバー側のみで使用
- ❌ **すべてのエラーで500を返す**: 適切なHTTPステータスコード(400, 401, 404など)を使用
- ❌ **グローバルstateの乱用**: 必要最小限のContextのみ使用
- ❌ **同期的なAPI呼び出し**: async/awaitで非同期処理

---

## 2. 既存コードの分析

### 2.1. 既存の型定義

| ファイルパス | 内容 | 参考にすべき点 |
|-------------|------|---------------|
| `types/auth.ts` | AuthSession, AuthSessionMethods, AuthRequest型定義 | ドメインモデルに基づいた型定義。JSDocコメントで責務を明確化。ライフサイクルを記載。 |
| `types/common.ts` | ApiStatus, ErrorResponse, SuccessResponse型定義 | ジェネリック型でAPI共通レスポンス形式を定義。再利用性が高い。 |
| `types/learning-material.ts` | LearningMaterial, QuizQuestion型定義(既存) | ドメインモデルと一致した型定義。今回のタスクで拡張予定。 |
| `types/learning-session.ts` | LearningSession, Answer型定義(既存) | セッション管理の型定義。今回のタスクで拡張予定。 |

### 2.2. 既存のAPI仕様

| ファイルパス | 内容 | 参考にすべき点 |
|-------------|------|---------------|
| `docs/project/04-design/05-api-spec.md` | 認証、教材生成、学習セッションのAPI仕様 | 統一されたエラーレスポンス形式。HTTPステータスコードの明確な定義。リクエスト/レスポンスのJSONスキーマ。 |

**実装パターン**:
- Cookieベース認証(HttpOnly)
- RESTful API設計
- 統一されたエラーレスポンス形式: `{ error: { code, message } }`
- 成功レスポンス形式: `{ data, message? }`

### 2.3. 既存のアーキテクチャ

| ファイルパス | 内容 | 参考にすべき点 |
|-------------|------|---------------|
| `docs/project/04-design/06-architecture.md` | システムアーキテクチャ、ADR、セキュリティ | Next.js App Router標準パターン。Feature-basedディレクトリ構造。ADRで技術的決定を記録。 |
| `docs/project/04-design/02-repository-structure.md` | ディレクトリ構造、命名規則、依存関係 | `lib/`にビジネスロジック、`app/api/`にAPI Routes、`components/`にUIコンポーネント。依存方向が明確。 |

**実装パターン**:
- Next.js App Router標準パターン
- レイヤードアーキテクチャ(Presentation → API → Business Logic → Data)
- インメモリデータ管理(データベース不使用)

---

## 3. 再利用可能なコンポーネント

### 3.1. 既存の共通コンポーネント

現時点では共通UIコンポーネントは未実装。以下を新規作成予定:

| コンポーネント名 | ファイルパス | 使用方法 | 備考 |
|-----------------|-------------|----------|------|
| `LoadingSpinner` | `components/LoadingSpinner.tsx` | `<LoadingSpinner />` | shadcn/uiのSpinnerコンポーネントを使用 |
| `ErrorMessage` | `components/ErrorMessage.tsx` | `<ErrorMessage message="エラー内容" />` | エラーメッセージ表示用 |
| `UrlInputForm` | `components/UrlInputForm.tsx` | `<UrlInputForm onSubmit={handleSubmit} />` | React Hook Form使用 |
| `QuizCard` | `components/QuizCard.tsx` | `<QuizCard question={q} onAnswer={handleAnswer} />` | ○×問題表示カード |
| `SummaryDisplay` | `components/SummaryDisplay.tsx` | `<SummaryDisplay summary={text} />` | サマリ表示コンポーネント |
| `ResultsDisplay` | `components/ResultsDisplay.tsx` | `<ResultsDisplay correctCount={7} total={10} />` | 結果表示コンポーネント |

### 3.2. 既存のカスタムフック

現時点ではカスタムフックは未実装。以下を新規作成予定:

| フック名 | ファイルパス | 使用方法 | 備考 |
|---------|-------------|----------|------|
| `useAuth` | `hooks/useAuth.ts` | `const { isAuthenticated, login, logout } = useAuth();` | AuthContext使用 |
| `useQuiz` | `hooks/useQuiz.ts` | `const { currentQuestion, submitAnswer } = useQuiz();` | QuizContext使用 |

### 3.3. 既存のユーティリティ関数

現時点ではユーティリティ関数は未実装。以下を新規作成予定:

| 関数名 | ファイルパス | 使用方法 | 備考 |
|--------|-------------|----------|------|
| `validateWikipediaUrl` | `lib/wikipedia/validateUrl.ts` | `validateWikipediaUrl(url)` | URL検証ロジック |
| `calculateCorrectRate` | `lib/utils/formatters.ts` | `calculateCorrectRate(correctCount, total)` | 正答率計算 |
| `handleApiError` | `lib/utils/errorHandlers.ts` | `handleApiError(error)` | エラーハンドリング |

---

## 4. 技術選定

### 4.1. 既に選定済みの技術

以下の技術は技術スタックドキュメント(`docs/project/04-design/01-tech-stack.md`)で既に選定済み:

| 技術・ライブラリ | 選定理由 | バージョン |
|----------------|---------|-----------|
| Next.js | フロントエンド+バックエンド統合。App Router使用。SSR/SSG対応。 | 14.x |
| React | Next.jsに含まれる。コンポーネントベース開発。 | 18.x |
| TypeScript | 型安全性、開発効率向上。フロント・バック共通。 | 5.x |
| Tailwind CSS | レスポンシブデザイン迅速実装。ユーティリティクラス。 | 3.x |
| shadcn/ui | Tailwindベース。カスタマイズ容易。 | - |
| React Hook Form | バリデーション、エラーハンドリング。パフォーマンス最適化。 | 7.x |
| Vitest | ユニットテスト。高速。 | 4.x |
| React Testing Library | コンポーネントテスト。 | 14.x |
| ESLint + Prettier | コード品質、フォーマッター。 | 8.x, 3.x |
| Railway | デプロイ。Git push自動デプロイ。環境変数管理。 | - |

### 4.2. 新規に選定が必要な技術

#### OpenAI API SDK

**選択肢**:
1. **openai (公式SDK)** - OpenAI公式のNode.js SDK
2. **fetch (組み込み)** - 直接REST APIを呼び出し

**選定**: **openai (公式SDK)**

**理由**:
- 型安全性が高い(TypeScript完全サポート)
- ストリーミングレスポンス対応
- エラーハンドリングが充実
- 公式サポートで安定性が高い

**代替案との比較**:
- fetch: 実装コストが高い、型安全性が低い

#### Wikipedia API クライアント

**選択肢**:
1. **fetch (組み込み)** - 直接REST APIを呼び出し
2. **axios** - HTTPクライアントライブラリ

**選定**: **fetch (組み込み)**

**理由**:
- 追加ライブラリ不要(バンドルサイズ削減)
- Wikipedia APIはシンプルなGETリクエストのみ
- Next.jsとの親和性が高い

**代替案との比較**:
- axios: 過剰(シンプルなAPIには不要)

---

## 5. リスクと対策

| リスク | 影響 | 軽減策 |
|--------|------|--------|
| **OpenAI API呼び出しの遅延** | サマリ・問題生成に30秒以上かかる可能性。UX悪化。 | ローディングスピナー表示。タイムアウト設定(60秒)。将来的にStreaming検討。 |
| **OpenAI API障害** | 教材生成が完全に停止。 | エラーメッセージで再試行を促す。将来的にフォールバック先検討(別のLLM)。 |
| **Wikipedia API障害** | 記事取得が失敗。 | エラーメッセージで再試行を促す。キャッシュ機構は不要(デモ用途)。 |
| **OpenAI APIコスト増加** | 不正利用でコスト増加。 | ベーシック認証で不特定多数のアクセスを防止。レート制限は実装しない(デモ用途)。 |
| **インメモリデータの消失** | サーバー再起動でセッションデータ消失。 | 仕様として許容(デモ用途)。ユーザーに事前通知。 |
| **同時接続数の制限** | 2-3人以上の同時利用でパフォーマンス低下。 | 仕様として許容(デモ用途)。スケール要件変更時にデータベース導入検討。 |
| **型定義の不整合** | フロント・バック間で型が一致せず、ランタイムエラー。 | `types/`ディレクトリで型定義を集約。API仕様と型定義を同期。 |
| **認証の脆弱性** | ベーシック認証は簡易的でセキュリティが限定的。 | HTTPS必須。本番環境では不十分(デモ用途のみ)。 |

---

## 6. 参考資料

### 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Wikipedia API Documentation](https://www.mediawiki.org/wiki/API:Main_page)
- [React Hook Form](https://react-hook-form.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### ベストプラクティス
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [REST API Best Practices](https://restfulapi.net/)
- [React Best Practices](https://react.dev/learn/thinking-in-react)

### プロジェクト内ドキュメント
- [技術スタック](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/01-tech-stack.md)
- [リポジトリ構造](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/02-repository-structure.md)
- [API仕様](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/05-api-spec.md)
- [アーキテクチャ](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/06-architecture.md)
- [ユビキタス言語](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/03-domain/02-ubiquitous-language.md)

---

## メモ

### 調査中に気づいた改善点

- **型定義の拡張**: 既存の`types/learning-material.ts`と`types/learning-session.ts`を拡張する必要がある
- **環境変数の追加**: `.env.example`に`AUTH_PASSWORD`、`OPENAI_API_KEY`、`NEXT_PUBLIC_APP_URL`を追加
- **shadcn/uiのセットアップ**: UIコンポーネント(Button, Input, Card, Spinner)のインストールが必要

### 今後の調査が必要な項目

- OpenAI APIのストリーミングレスポンス実装(将来的な拡張)
- E2Eテストのフレームワーク選定(Playwright vs Cypress)
- アクセシビリティ対応(WCAG 2.1 AA準拠)

### 実装時の注意事項

- **ユビキタス言語の厳守**: 型定義、変数名、コメントでユビキタス言語を使用
- **依存方向の遵守**: `lib/` → `types/`、`app/api/` → `lib/`、`components/` → `types/`
- **テストファーストアプローチ**: ビジネスロジック(`lib/`)は必ずユニットテストを書く
- **エラーハンドリングの統一**: `lib/utils/errorHandlers.ts`で統一的なエラーハンドリング
- **パフォーマンス**: React Hook Formで非制御コンポーネント、Context分離でパフォーマンス最適化

