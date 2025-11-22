# 実装タスクリスト

<!--
このドキュメントについて:
  - 格納場所: docs/tasks/task000003-implement-core-features/c-implementation.md
  - 作成方法: /b-003-CreateTaskImplementation ワークフローで作成
  - 実行方法: /c-001-ImplementTask ワークフローで各ステップを実行
  - 前提条件: a-definition.md と b-research.md が作成済みであること
  - 関連ドキュメント:
    - a-definition.md (タスク定義ドキュメント)
    - b-research.md (リサーチドキュメント)

このドキュメントの目的:
  - 実装作業を段階的に分割して管理
  - 進捗の可視化とチーム共有
  - 各ステップの成果物を明確化
  - 実装漏れの防止

更新タイミング:
  - 実装開始前にフェーズ分割を計画
  - 各ステップ完了時にチェック(/c-001-ImplementTask が自動更新)
  - 新たな作業が発覚した際に追加
  - レビュー指摘事項を反映
-->

---

## フェーズ 1: 基盤セットアップ

<!--
目的: プロジェクトの基盤となる環境設定、依存関係のインストール、型定義の整備を行う
ベストプラクティス: 
  - 環境変数は.env.exampleで管理し、実際の値は.envに記載
  - 型定義はドメインモデルに基づいて厳密に定義
  - shadcn/uiコンポーネントは必要最小限をインストール
-->

**完了条件:**
- 環境変数が設定され、アプリケーションが起動する
- TypeScriptコンパイルエラーがない
- 必要なUIコンポーネントがインストールされている

### ステップ

- [x] **ステップ 1.1:** 環境変数テンプレートと実際の環境変数ファイルの作成
  - **成果物:** `.env.example`, `.env.local`
  - **詳細:** 
    - `.env.example`を作成し、以下の環境変数テンプレートを記載:
      - `AUTH_PASSWORD=demo-password` - ベーシック認証パスワード(例)
      - `OPENAI_API_KEY=sk-...` - OpenAI APIキー(プレースホルダー)
      - `NEXT_PUBLIC_APP_URL=http://localhost:3000` - アプリケーションURL(例)
    - `.env.local`ファイルを作成し、実際のAPIキーと認証パスワードを設定:
      - `AUTH_PASSWORD` - 実際のパスワード
      - `OPENAI_API_KEY` - 実際のOpenAI APIキー
      - `NEXT_PUBLIC_APP_URL` - 実際のアプリケーションURL
    - `.env.local`が`.gitignore`に含まれていることを確認(機密情報の保護)

- [x] **ステップ 1.2:** OpenAI SDK のインストール
  - **成果物:** `package.json`に`openai`が追加される
  - **詳細:** 
    - `npm install openai` を実行
    - バージョン: 最新の安定版(4.x系)

- [x] **ステップ 1.3:** shadcn/ui コンポーネントのインストール
  - **成果物:** `components/ui/`ディレクトリにUIコンポーネント
  - **詳細:** 
    - `npx shadcn-ui@latest init` でshadcn/uiをセットアップ
    - 必要なコンポーネントをインストール:
      - `npx shadcn-ui@latest add button`
      - `npx shadcn-ui@latest add input`
      - `npx shadcn-ui@latest add card`
      - `npx shadcn-ui@latest add label`
      - `npx shadcn-ui@latest add alert`

- [x] **ステップ 1.4:** 共通型定義の拡張
  - **成果物:** `types/learning-material.ts`, `types/learning-session.ts`の更新
  - **詳細:** 
    - `types/learning-material.ts`に以下を追加:
      - `wikipediaUrl: string` - Wikipedia記事URL
      - `articleTitle: string` - 記事タイトル
      - `articleText: string` - 記事本文
    - `types/learning-session.ts`に以下を追加:
      - `LearningSession`型: `id`, `materialId`, `answers`, `startedAt`, `completedAt`
      - `Answer`型: `questionId`, `userAnswer`, `isCorrect`, `answeredAt`

- [x] **ステップ 1.5:** ユーティリティ型定義の作成
  - **成果物:** `types/utils.ts`
  - **詳細:** 
    - `Result<T, E>` - 成功/失敗を表す型
    - `AsyncResult<T, E>` - 非同期版Result型
    - 既存の`types/common.ts`と整合性を保つ

---

## フェーズ 2: 認証機能 (US-007)

<!--
目的: ベーシック認証を実装し、不特定多数のアクセスを防ぐ
ベストプラクティス:
  - HttpOnly Cookieでセッション管理
  - パスワードは環境変数で管理
  - ミドルウェアで認証チェックを一元化
-->

**完了条件:**
- ログインページでパスワード認証ができる
- 認証済みユーザーのみが保護されたページにアクセスできる
- 未認証ユーザーはログインページにリダイレクトされる
- ログアウト機能が動作する

### ステップ

- [x] **ステップ 2.1:** ログイン API エンドポイント実装
  - **成果物:** `app/api/auth/login/route.ts`
  - **詳細:**
    - POST /api/auth/login
    - リクエスト: `{ password: string }`
    - 環境変数`AUTH_PASSWORD`と照合
    - 認証成功時: HttpOnly Cookieに`auth_token`を設定、`{ success: true }`を返却
    - 認証失敗時: 401エラー、`{ error: { code: "INVALID_PASSWORD", message: "パスワードが間違っています。" } }`

- [x] **ステップ 2.2:** ログアウト API エンドポイント実装
  - **成果物:** `app/api/auth/logout/route.ts`
  - **詳細:**
    - POST /api/auth/logout
    - `auth_token` Cookieを削除(Max-Age=0)
    - レスポンス: `{ success: true }`

- [x] **ステップ 2.3:** 認証状態確認 API 実装
  - **成果物:** `app/api/auth/me/route.ts`
  - **詳細:**
    - GET /api/auth/me
    - `auth_token` Cookieを検証
    - 認証済み: `{ isAuthenticated: true }`
    - 未認証: `{ isAuthenticated: false }`(401エラーにはしない)

- [x] **ステップ 2.4:** AuthContext 実装
  - **成果物:** `contexts/AuthContext.tsx`
  - **詳細:**
    - `AuthProvider`コンポーネント
    - `useAuth`フック: `isAuthenticated`, `isLoading`, `login(password)`, `logout()`, `checkAuth()`
    - 初回マウント時に`/api/auth/me`で認証状態を確認
    - `login`は`/api/auth/login`を呼び出し、成功時に`isAuthenticated`を`true`に設定

- [x] **ステップ 2.5:** 認証済みレイアウト作成
  - **成果物:** `app/(auth)/layout.tsx`
  - **詳細:**
    - `AuthProvider`でラップ
    - 認証チェック: 未認証の場合は`/login`にリダイレクト
    - ローディング中はローディングスピナー表示
    - 認証済みの場合は`children`を表示

- [x] **ステップ 2.6:** ログインページ作成
  - **成果物:** `app/login/page.tsx`
  - **詳細:**
    - パスワード入力フィールド(type="password")
    - ログインボタン
    - エラーメッセージ表示エリア
    - React Hook Formでフォーム管理
    - 認証成功時は`/`にリダイレクト
    - shadcn/ui Input, Button, Card使用

---

## フェーズ 3: Wikipedia API連携 (US-001)

<!--
目的: Wikipedia APIから記事テキストを取得する機能を実装
ベストプラクティス: 
  - URL検証を厳密に行う
  - エラーハンドリングを適切に実装
  - fetchでシンプルに実装
-->

**完了条件:**
- Wikipedia URLを検証できる
- Wikipedia APIから記事テキストを取得できる
- エラーケース(無効なURL、API障害)が適切に処理される
- Wikipedia連携のユニットテストが通る

### ステップ

- [ ] **ステップ 3.1:** Wikipedia URL検証ロジックの実装
  - **成果物:** `lib/wikipedia/validateUrl.ts`
  - **詳細:** 
    - `validateWikipediaUrl(url: string): Result<string, string>` - URL検証
    - 正規表現で`https://(ja|en).wikipedia.org/wiki/...`形式をチェック
    - 記事タイトルを抽出して返す
    - エラー時は`{ success: false, error: "有効なWikipedia URLを入力してください" }`

- [ ] **ステップ 3.2:** Wikipedia APIクライアントの実装
  - **成果物:** `lib/wikipedia/client.ts`
  - **詳細:** 
    - `fetchArticle(articleTitle: string, lang: 'ja' | 'en'): Promise<{ title: string, text: string }>` - 記事取得
    - Wikipedia API: `https://{lang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext=true&titles={title}`
    - fetchでGETリクエスト
    - レスポンスからテキストを抽出
    - エラーハンドリング: ネットワークエラー、記事が存在しない場合

- [ ] **ステップ 3.3:** Wikipedia連携のユニットテスト
  - **成果物:** `__tests__/lib/wikipedia/validateUrl.test.ts`, `__tests__/lib/wikipedia/client.test.ts`
  - **詳細:** 
    - `validateWikipediaUrl`のテスト(有効なURL、無効なURL、空文字列)
    - `fetchArticle`のテスト(モックレスポンス、エラーケース)

---

## フェーズ 4: OpenAI API連携と教材生成 (US-001, US-002, US-003)

<!--
目的: OpenAI APIでサマリと○×問題を生成し、教材生成APIを実装
ベストプラクティス: 
  - OpenAI SDK使用で型安全性確保
  - プロンプトは明確で具体的に
  - タイムアウト設定(60秒)
-->

**完了条件:**
- OpenAI APIでサマリを生成できる
- OpenAI APIで10問の○×問題を生成できる
- 教材生成APIが動作する
- URL入力画面とサマリ表示画面が実装される
- OpenAI連携のユニットテストが通る

### ステップ

- [ ] **ステップ 4.1:** OpenAI クライアントの初期化
  - **成果物:** `lib/openai/client.ts`
  - **詳細:** 
    - OpenAI SDKをインポート
    - `const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })`
    - エクスポートして他のモジュールで使用

- [ ] **ステップ 4.2:** サマリ生成ロジックの実装
  - **成果物:** `lib/openai/generateSummary.ts`
  - **詳細:** 
    - `generateSummary(articleText: string): Promise<string>` - サマリ生成
    - OpenAI Chat Completions API使用(gpt-4o-mini)
    - プロンプト: "以下のWikipedia記事を3行で要約してください。各行は簡潔に。\n\n{articleText}"
    - タイムアウト: 60秒
    - エラーハンドリング: API障害、レート制限

- [ ] **ステップ 4.3:** ○×問題生成ロジックの実装
  - **成果物:** `lib/openai/generateQuestions.ts`
  - **詳細:** 
    - `generateQuestions(articleText: string): Promise<QuizQuestion[]>` - ○×問題生成
    - OpenAI Chat Completions API使用(gpt-4o-mini)
    - プロンプト: "以下のWikipedia記事から10問の○×問題を生成してください。JSON形式で返してください。\n\n{articleText}\n\nフォーマット: [{ \"id\": \"q1\", \"text\": \"問題文\", \"correctAnswer\": true }]"
    - レスポンスをパースして`QuizQuestion[]`に変換
    - タイムアウト: 60秒
    - エラーハンドリング: JSON解析エラー、API障害

- [ ] **ステップ 4.4:** 教材生成APIの実装
  - **成果物:** `app/api/materials/route.ts`
  - **詳細:** 
    - POST /api/materials
    - リクエスト: `{ wikipediaUrl: string }`
    - 処理フロー:
      1. URL検証(`validateWikipediaUrl`)
      2. Wikipedia記事取得(`fetchArticle`)
      3. サマリ生成(`generateSummary`)
      4. ○×問題生成(`generateQuestions`)
      5. `LearningMaterial`オブジェクト作成
    - レスポンス: `{ data: LearningMaterial }`
    - エラーハンドリング: 各ステップでのエラーを適切に処理

- [ ] **ステップ 4.5:** ローディングスピナーコンポーネントの実装
  - **成果物:** `components/LoadingSpinner.tsx`
  - **詳細:** 
    - shadcn/uiのSpinnerコンポーネントを使用
    - プロップ: `message?: string` - ローディングメッセージ

- [ ] **ステップ 4.6:** エラーメッセージコンポーネントの実装
  - **成果物:** `components/ErrorMessage.tsx`
  - **詳細:** 
    - shadcn/uiのAlertコンポーネントを使用
    - プロップ: `message: string` - エラーメッセージ
    - バリアント: destructive

- [ ] **ステップ 4.7:** URL入力フォームコンポーネントの実装
  - **成果物:** `components/UrlInputForm.tsx`
  - **詳細:** 
    - React Hook Form使用
    - バリデーション: URL形式チェック
    - プロップ: `onSubmit: (url: string) => void`, `isLoading: boolean`
    - shadcn/ui Input, Button使用

- [ ] **ステップ 4.8:** URL入力画面の実装
  - **成果物:** `app/page.tsx`(更新)
  - **詳細:** 
    - `UrlInputForm`コンポーネント配置
    - 送信時に`/api/materials`を呼び出し
    - ローディング中は`LoadingSpinner`表示
    - エラー時は`ErrorMessage`表示
    - 成功時はサマリ表示画面(`/summary`)にリダイレクト

- [ ] **ステップ 4.9:** サマリ表示コンポーネントの実装
  - **成果物:** `components/SummaryDisplay.tsx`
  - **詳細:** 
    - プロップ: `summary: string`, `articleTitle: string`
    - shadcn/ui Cardコンポーネント使用
    - 3行サマリを表示
    - 「○×問題を開始」ボタン

- [ ] **ステップ 4.10:** サマリ表示画面の実装
  - **成果物:** `app/(auth)/summary/page.tsx`
  - **詳細:** 
    - `SummaryDisplay`コンポーネント配置
    - 「○×問題を開始」ボタンクリックで`/quiz`にリダイレクト
    - 教材データはContextから取得

- [ ] **ステップ 4.11:** OpenAI連携のユニットテスト
  - **成果物:** `__tests__/lib/openai/generateSummary.test.ts`, `__tests__/lib/openai/generateQuestions.test.ts`
  - **詳細:** 
    - `generateSummary`のテスト(モックレスポンス、エラーケース)
    - `generateQuestions`のテスト(モックレスポンス、JSON解析エラー)

---

## フェーズ 5: 学習セッション機能 (US-003, US-004, US-005, US-006)

<!--
目的: ○×問題の回答、フィードバック、結果表示機能を実装
ベストプラクティス: 
  - セッション管理はインメモリで実装
  - Context分離でパフォーマンス最適化
  - 即座のフィードバックでUX向上
-->

**完了条件:**
- 学習セッションを開始できる
- ○×問題に回答し、即座にフィードバックを得られる
- 全問終了後に結果を表示できる
- 別の記事で再学習できる
- セッション管理のユニットテストが通る

### ステップ

- [ ] **ステップ 5.1:** インメモリセッションストアの実装
  - **成果物:** `lib/session/sessionStore.ts`
  - **詳細:** 
    - `Map<string, LearningSession>`でセッション管理
    - `createSession(materialId: string): LearningSession` - セッション作成
    - `getSession(sessionId: string): LearningSession | null` - セッション取得
    - `submitAnswer(sessionId: string, answer: Answer): void` - 回答記録
    - `calculateResult(sessionId: string): { correctCount: number, totalCount: number, correctRate: number }` - 結果計算

- [ ] **ステップ 5.2:** セッション開始APIの実装
  - **成果物:** `app/api/sessions/route.ts`
  - **詳細:** 
    - POST /api/sessions
    - リクエスト: `{ materialId: string }`
    - セッション作成し、セッションIDを返す
    - レスポンス: `{ data: { sessionId: string } }`

- [ ] **ステップ 5.3:** 回答送信APIの実装
  - **成果物:** `app/api/sessions/[id]/answers/route.ts`
  - **詳細:** 
    - POST /api/sessions/{id}/answers
    - リクエスト: `{ questionId: string, userAnswer: boolean }`
    - 回答を記録し、正解/不正解を返す
    - レスポンス: `{ data: { isCorrect: boolean, correctAnswer: boolean } }`

- [ ] **ステップ 5.4:** 結果取得APIの実装
  - **成果物:** `app/api/sessions/[id]/result/route.ts`
  - **詳細:** 
    - GET /api/sessions/{id}/result
    - 結果計算し、正答数・正答率を返す
    - レスポンス: `{ data: { correctCount: number, totalCount: number, correctRate: number } }`

- [ ] **ステップ 5.5:** ○×問題Contextの実装
  - **成果物:** `contexts/QuizContext.tsx`
  - **詳細:** 
    - `QuizProvider`コンポーネント
    - `useQuiz`フック: `currentQuestionIndex`, `currentQuestion`, `submitAnswer(answer)`, `goToNext()`, `isCompleted`
    - セッションIDと教材データを管理

- [ ] **ステップ 5.6:** ○×問題カードコンポーネントの実装
  - **成果物:** `components/QuizCard.tsx`
  - **詳細:** 
    - プロップ: `question: QuizQuestion`, `onAnswer: (answer: boolean) => void`, `feedback?: { isCorrect: boolean, correctAnswer: boolean }`
    - shadcn/ui Cardコンポーネント使用
    - ○ボタン、×ボタン
    - フィードバック表示(正解/不正解、正しい答え)
    - 「次へ」ボタン

- [ ] **ステップ 5.7:** ○×問題回答画面の実装
  - **成果物:** `app/(auth)/quiz/page.tsx`
  - **詳細:** 
    - `QuizCard`コンポーネント配置
    - 現在の○×問題番号表示(例: 1/10)
    - 回答送信時に`/api/sessions/{id}/answers`を呼び出し
    - フィードバック表示後、「次へ」ボタンで次の○×問題に進む
    - 最終問題の回答後、結果表示画面(`/results`)にリダイレクト

- [ ] **ステップ 5.8:** 結果表示コンポーネントの実装
  - **成果物:** `components/ResultsDisplay.tsx`
  - **詳細:** 
    - プロップ: `correctCount: number`, `totalCount: number`, `correctRate: number`
    - shadcn/ui Cardコンポーネント使用
    - 正答数、正答率を表示
    - 「別の記事で試す」ボタン

- [ ] **ステップ 5.9:** 結果表示画面の実装
  - **成果物:** `app/(auth)/results/page.tsx`
  - **詳細:** 
    - `ResultsDisplay`コンポーネント配置
    - `/api/sessions/{id}/result`から結果取得
    - 「別の記事で試す」ボタンクリックで`/`にリダイレクト
    - Contextをクリア

- [ ] **ステップ 5.10:** セッション管理のユニットテスト
  - **成果物:** `__tests__/lib/session/sessionStore.test.ts`
  - **詳細:** 
    - `createSession`のテスト
    - `submitAnswer`のテスト
    - `calculateResult`のテスト(正答率計算)

---

## フェーズ 6: エラーハンドリングとUI改善 (US-008)

<!--
目的: エラーケースを適切に処理し、ユーザーフレンドリーなメッセージを表示
ベストプラクティス: 
  - 統一されたエラーハンドリング関数
  - 適切なHTTPステータスコード
  - ユーザーに分かりやすいエラーメッセージ
-->

**完了条件:**
- すべてのエラーケースが適切に処理される
- エラーメッセージがユーザーフレンドリーである
- UIが洗練されている

### ステップ

- [ ] **ステップ 6.1:** エラーハンドリング関数の実装
  - **成果物:** `lib/utils/errorHandlers.ts`
  - **詳細:** 
    - `handleApiError(error: unknown): ErrorResponse` - API エラーハンドリング
    - エラーの種類に応じて適切なHTTPステータスコードとメッセージを返す
    - 例: ネットワークエラー、タイムアウト、API障害

- [ ] **ステップ 6.2:** バリデーション関数の実装
  - **成果物:** `lib/utils/validators.ts`
  - **詳細:** 
    - `validateUrl(url: string): boolean` - URL形式検証
    - `validatePassword(password: string): boolean` - パスワード検証
    - Zodスキーマを使用

- [ ] **ステップ 6.3:** 全APIエンドポイントのエラーハンドリング強化
  - **成果物:** 既存のAPIファイルを更新
  - **詳細:** 
    - try-catchブロックで適切にエラーをキャッチ
    - `handleApiError`を使用して統一されたエラーレスポンスを返す
    - 適切なHTTPステータスコード(400, 401, 404, 500)

- [ ] **ステップ 6.4:** UI/UXの改善
  - **成果物:** 既存のコンポーネントを更新
  - **詳細:** 
    - レスポンシブデザインの確認
    - アクセシビリティの改善(aria-label, role)
    - ローディング状態の視覚的フィードバック
    - エラーメッセージのスタイリング

---

## フェーズ 7: テスト・検証

<!--
目的: 全機能のテストを実施し、品質を保証
ベストプラクティス: 
  - ユニットテスト: ビジネスロジック
  - 統合テスト: API Routes
  - E2Eテスト: ユーザーフロー全体
-->

**完了条件:**
- すべてのユニットテストが通る
- 統合テストが通る
- E2Eテスト(オプション)が通る
- ビルドが成功する
- Lintエラーがない

### ステップ

- [ ] **ステップ 7.1:** 統合テストの実装
  - **成果物:** `__tests__/api/`ディレクトリに統合テスト
  - **詳細:** 
    - `/api/auth/login`の統合テスト
    - `/api/materials`の統合テスト
    - `/api/sessions`の統合テスト
    - モックデータを使用

- [ ] **ステップ 7.2:** E2Eテストの実装(オプション)
  - **成果物:** `e2e/`ディレクトリにE2Eテスト
  - **詳細:** 
    - Playwrightを使用
    - ログインから教材生成、学習セッション、結果表示までの一連のフロー
    - エラーケースのテスト

- [ ] **ステップ 7.3:** ビルド・Lintの確認
  - **成果物:** ビルド成功、Lintエラーなし
  - **詳細:** 
    - `npm run build` を実行し、エラーがないことを確認
    - `npm run lint` を実行し、エラーがないことを確認
    - `npm run test` を実行し、全テストが通ることを確認

- [ ] **ステップ 7.4:** 手動テスト
  - **成果物:** テスト結果ドキュメント
  - **詳細:** 
    - 受け入れ基準に基づいて手動テスト
    - 正常系フロー: ログイン → URL入力 → サマリ表示 → ○×問題回答 → 結果表示
    - 異常系フロー: 無効なURL、誤ったパスワード、API障害

- [ ] **ステップ 7.5:** Railwayへのデプロイ
  - **成果物:** デプロイ成功
  - **詳細:** 
    - 環境変数を設定(`AUTH_PASSWORD`, `OPENAI_API_KEY`, `NEXT_PUBLIC_APP_URL`)
    - Railwayにプッシュし、自動デプロイ
    - デプロイ後の動作確認

---

## 受け入れ基準

### 正常系

- [ ] ログインページでパスワードを入力し、正しいパスワードで認証成功する
- [ ] 認証成功後、URL入力画面にリダイレクトされる
- [ ] URL入力画面でWikipedia URLを入力し、送信ボタンをクリックする
- [ ] サマリ表示画面に遷移し、3行サマリが表示される
- [ ] 「○×問題を開始」ボタンをクリックすると、○×問題回答画面に遷移する
- [ ] 1問目が表示され、現在の○×問題番号(1/10)が表示される
- [ ] ○ボタンまたは×ボタンをクリックすると、即座に正解/不正解のフィードバックが表示される
- [ ] 「次へ」ボタンをクリックすると、次の○×問題に進む
- [ ] 10問目の回答後、結果表示画面に自動遷移する
- [ ] 正答数と正答率が表示される
- [ ] 「別の記事で試す」ボタンをクリックすると、URL入力画面に戻る

### 異常系

- [ ] 誤ったパスワードを入力すると、「パスワードが間違っています」エラーメッセージが表示される
- [ ] 未認証ユーザーが保護されたページにアクセスすると、ログインページにリダイレクトされる
- [ ] 無効なURL(Wikipedia以外)を入力すると、「有効なWikipedia URLを入力してください」エラーメッセージが表示される
- [ ] Wikipedia API呼び出しが失敗すると、「記事の取得に失敗しました」エラーメッセージが表示される
- [ ] OpenAI API呼び出しが失敗すると、「教材の生成に失敗しました」エラーメッセージが表示される

### テスト・品質

- [ ] `npm run test` が全テストをパスする
- [ ] `npm run build` がエラーなく完了する
- [ ] `npm run lint` がエラーなく完了する
- [ ] Railwayへのデプロイが成功する

### パフォーマンス

- [ ] URL入力画面の初期表示が2秒以内
- [ ] サマリ生成が30秒以内(OpenAI API呼び出し含む)
- [ ] ○×問題回答画面の表示が1秒以内

### セキュリティ

- [ ] パスワードは環境変数で管理され、ハードコードされていない
- [ ] OpenAI APIキーはサーバー側のみで使用され、クライアントに露出しない
- [ ] 認証CookieはHttpOnlyフラグが設定されている

---

## メモ

### 実装時の注意事項

- **ユビキタス言語の厳守**: 型定義、変数名、コメントでユビキタス言語を使用
- **依存方向の遵守**: `lib/` → `types/`、`app/api/` → `lib/`、`components/` → `types/`
- **テストファーストアプローチ**: ビジネスロジック(`lib/`)は必ずユニットテストを書く
- **エラーハンドリングの統一**: `lib/utils/errorHandlers.ts`で統一的なエラーハンドリング
- **パフォーマンス**: React Hook Formで非制御コンポーネント、Context分離でパフォーマンス最適化

### 技術的な課題

- **OpenAI API呼び出しの遅延**: ローディングスピナー表示、タイムアウト設定(60秒)
- **インメモリデータの消失**: サーバー再起動でセッションデータ消失(仕様として許容)
- **同時接続数の制限**: 2-3人想定(スケーラビリティは考慮しない)

### 今後の拡張予定

- OpenAI APIのストリーミングレスポンス実装
- データベース導入(PostgreSQL)
- 学習履歴の永続化
- モバイルアプリ対応
