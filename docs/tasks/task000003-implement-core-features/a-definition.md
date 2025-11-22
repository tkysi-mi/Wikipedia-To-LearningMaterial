# タスク定義ドキュメント

<!--
このドキュメントについて:
  - 格納場所: docs/tasks/task000003-implement-core-features/a-definition.md
  - 作成方法: /b-001-CreateTaskDefinition ワークフローで作成
  - 前提条件: タスクディレクトリが作成済みであること
  - 関連ドキュメント:
    - b-research.md (リサーチドキュメント)
    - c-implementation.md (実装タスクリスト)

このドキュメントの目的:
  - タスクの目的と背景を明確化
  - 変更内容のスコープを定義
  - 受け入れ基準を設定
  - 関係者間の認識を統一

更新タイミング:
  - タスク開始前に初版作成
  - スコープ変更時に更新
  - レビュー指摘事項を反映
-->

---

## タスク概要

**タスクID**: task000003-implement-core-features

**タスク名**: コア機能の実装

**優先度**: 高

**担当者**: (未定)

**期限**: (未定)

---

## 目的

### 解決する問題

現在、プロジェクトは要件定義・設計フェーズが完了し、実装可能な状態にあるが、以下の問題がある:

- **機能が未実装**: Wikipedia記事から学習教材を生成する機能が実装されていない
- **ユーザー価値の未提供**: 社会人が能動的に学習できる環境が提供されていない
- **デモアプリケーションの未完成**: 要件定義で定めた8つのユーザーストーリー(US-001〜US-008)がすべて未実装

### 提供する価値

このタスクが完了すると、以下の価値を提供する:

**ユーザー(社会人・自習者)への価値**:
- Wikipedia記事から自動生成された○×問題で能動的に学習できる
- 3行サマリで記事の概要を素早く把握できる
- 即座のフィードバックで理解度を確認し、記憶に定着させられる
- 正答数・正答率で学習の成果を確認し、達成感を得られる

**システム管理者への価値**:
- ベーシック認証で不特定多数のアクセスを防ぎ、OpenAI APIの不正利用によるコスト増加を回避できる

**プロジェクトへの価値**:
- デモアプリケーションとして動作可能な状態になる
- 要件定義で定めたすべてのユーザーストーリーが実装される
- 設計ドキュメント(技術スタック、アーキテクチャ、API仕様、データ構造)の妥当性を検証できる

---

## ユーザーストーリー

このタスクで実装するユーザーストーリー(既存ドキュメント `docs/project/01-requirements/05-user-stories.md` より):

| ストーリーID | ストーリー |
|--------------|-----------|
| US-001 | 社会人として、WikipediaのURLを入力したい、なぜなら学習したいトピックの記事を選択し、教材を生成したいから |
| US-002 | 社会人として、Wikipedia記事の3行サマリを読みたい、なぜなら記事の概要を素早く把握し、学習価値があるか判断したいから |
| US-003 | 社会人として、○×問題を1問ずつ解きたい、なぜなら記事を注意深く読むモチベーションを得て、能動的な学習体験をしたいから |
| US-004 | 社会人として、回答後に正解/不正解のフィードバックを即座に得たい、なぜなら自分の理解度を確認し、記憶に定着させたいから |
| US-005 | 社会人として、全問終了後に正答数と正答率を見たい、なぜなら学習の成果を確認し、達成感を得たいから |
| US-006 | 社会人として、別のWikipedia記事でも学習したい、なぜなら様々なトピックで知識を広げたいから |
| US-007 | システム管理者として、不特定多数のアクセスを防ぎたい、なぜならOpenAI APIの不正利用によるコスト増加を避けたいから |
| US-008 | 社会人として、エラーが発生した際に適切なメッセージを見たい、なぜなら何が問題なのかを理解し、適切に対処したいから |

---

## 変更内容

### 1. 認証機能 (US-007)

#### ビジネスロジック
- **新規**: `lib/auth/basicAuth.ts` - ベーシック認証ロジック実装
- **新規**: `lib/auth/middleware.ts` - 認証ミドルウェア実装

#### API
- **新規**: `app/api/auth/login/route.ts` - POST /api/auth/login (パスワード検証、Cookie発行)
- **新規**: `app/api/auth/logout/route.ts` - POST /api/auth/logout (Cookie削除)
- **新規**: `app/api/auth/me/route.ts` - GET /api/auth/me (認証状態確認)

#### 画面
- **新規**: `app/login/page.tsx` - ログインページ(パスワード入力フォーム)
- **新規**: `app/(auth)/layout.tsx` - 認証済みページ共通レイアウト(認証チェック)

#### 状態管理
- **新規**: `contexts/AuthContext.tsx` - 認証状態管理Context
- **新規**: `hooks/useAuth.ts` - 認証フック

#### 型定義
- **新規**: `types/auth.ts` - AuthSession型定義

---

### 2. Wikipedia API連携 (US-001)

#### ビジネスロジック
- **新規**: `lib/wikipedia/client.ts` - Wikipedia API呼び出し
- **新規**: `lib/wikipedia/validateUrl.ts` - URL検証ロジック

#### 型定義
- **更新**: `types/learning-material.ts` - LearningMaterial型にwikipediaUrl, articleTitle, articleText追加

---

### 3. OpenAI API連携 (US-002, US-003)

#### ビジネスロジック
- **新規**: `lib/openai/client.ts` - OpenAI API初期化
- **新規**: `lib/openai/generateSummary.ts` - サマリ生成ロジック
- **新規**: `lib/openai/generateQuestions.ts` - ○×問題生成ロジック

---

### 4. 教材生成機能 (US-001, US-002)

#### API
- **新規**: `app/api/materials/route.ts` - POST /api/materials (Wikipedia URL受信、教材生成)

#### 画面
- **更新**: `app/page.tsx` - URL入力画面(入力フォーム、送信ボタン、エラー表示)
- **新規**: `app/(auth)/summary/page.tsx` - サマリ表示画面(3行サマリ、「問題を開始」ボタン)

#### UIコンポーネント
- **新規**: `components/UrlInputForm.tsx` - URL入力フォーム
- **新規**: `components/SummaryDisplay.tsx` - サマリ表示コンポーネント
- **新規**: `components/LoadingSpinner.tsx` - ローディング表示

---

### 5. 学習セッション機能 (US-003, US-004, US-005, US-006)

#### ビジネスロジック
- **新規**: `lib/session/sessionStore.ts` - インメモリセッション管理

#### API
- **新規**: `app/api/sessions/route.ts` - POST /api/sessions (セッション開始)
- **新規**: `app/api/sessions/[id]/answers/route.ts` - POST /api/sessions/{id}/answers (回答送信)
- **新規**: `app/api/sessions/[id]/result/route.ts` - GET /api/sessions/{id}/result (結果取得)

#### 画面
- **新規**: `app/(auth)/quiz/page.tsx` - ○×問題回答画面(○×問題表示、○×ボタン、フィードバック表示)
- **新規**: `app/(auth)/results/page.tsx` - 結果表示画面(正答数、正答率、「別の記事で試す」ボタン)

#### UIコンポーネント
- **新規**: `components/QuizCard.tsx` - ○×問題表示カード
- **新規**: `components/ResultsDisplay.tsx` - 結果表示コンポーネント

#### 状態管理
- **新規**: `contexts/QuizContext.tsx` - ○×問題セッション状態管理Context
- **新規**: `hooks/useQuiz.ts` - ○×問題管理フック

#### 型定義
- **更新**: `types/learning-session.ts` - LearningSession, Answer型定義

---

### 6. エラーハンドリング (US-008)

#### ユーティリティ
- **新規**: `lib/utils/errorHandlers.ts` - エラーハンドリング関数
- **新規**: `lib/utils/validators.ts` - バリデーション関数

#### UIコンポーネント
- **新規**: `components/ErrorMessage.tsx` - エラーメッセージ表示コンポーネント

---

### 7. 環境変数

- **新規**: `.env.example` - 環境変数テンプレート
  - `AUTH_PASSWORD` - ベーシック認証パスワード
  - `OPENAI_API_KEY` - OpenAI APIキー
  - `NEXT_PUBLIC_APP_URL` - アプリケーションURL

---

## 受け入れ基準

### 正常系

#### 認証フロー
- [ ] ログインページでパスワードを入力し、正しいパスワードで認証成功する
- [ ] 認証成功後、URL入力画面にリダイレクトされる
- [ ] 認証済みユーザーは全ての機能にアクセスできる
- [ ] ログアウトボタンをクリックすると、ログインページにリダイレクトされる

#### 教材生成フロー
- [ ] URL入力画面でWikipedia URLを入力し、送信ボタンをクリックする
- [ ] Wikipedia APIから記事テキストが正常に取得される
- [ ] OpenAI APIで3行サマリが生成される
- [ ] OpenAI APIで10問の○×問題が生成される
- [ ] サマリ表示画面に遷移し、3行サマリが表示される
- [ ] 「○×問題を開始」ボタンが表示される

#### 学習セッションフロー
- [ ] 「○×問題を開始」ボタンをクリックすると、○×問題回答画面に遷移する
- [ ] 1問目が表示され、現在の○×問題番号(1/10)が表示される
- [ ] ○ボタンまたは×ボタンをクリックすると、回答が送信される
- [ ] 即座に正解/不正解のフィードバックが表示される
- [ ] 「次へ」ボタンをクリックすると、次の○×問題に進む
- [ ] ○×問題2〜10問目も同様に回答できる
- [ ] 10問目の回答後、結果表示画面に自動遷移する
- [ ] 正答数と正答率が表示される
- [ ] 「別の記事で試す」ボタンをクリックすると、URL入力画面に戻る
- [ ] 前回の学習データ(サマリ、問題、回答)がクリアされる

### 異常系・エラーケース

#### 認証エラー
- [ ] 誤ったパスワードを入力すると、「パスワードが間違っています」エラーメッセージが表示される
- [ ] 未認証ユーザーが保護されたページにアクセスすると、ログインページにリダイレクトされる

#### URL検証エラー
- [ ] 無効なURL(Wikipedia以外)を入力すると、「有効なWikipedia URLを入力してください」エラーメッセージが表示される
- [ ] 空のURLを送信すると、「URLを入力してください」エラーメッセージが表示される

#### API呼び出しエラー
- [ ] Wikipedia API呼び出しが失敗すると、「記事の取得に失敗しました。URLを確認してください」エラーメッセージが表示される
- [ ] OpenAI API呼び出しが失敗すると、「教材の生成に失敗しました。しばらく待ってから再試行してください」エラーメッセージが表示される

### テスト・品質

#### ユニットテスト
- [ ] `lib/auth/basicAuth.ts` のユニットテストが通る
- [ ] `lib/wikipedia/validateUrl.ts` のユニットテストが通る
- [ ] `lib/openai/generateSummary.ts` のユニットテストが通る
- [ ] `lib/openai/generateQuestions.ts` のユニットテストが通る
- [ ] `lib/session/sessionStore.ts` のユニットテストが通る

#### 統合テスト
- [ ] API Routes(`/api/auth/login`, `/api/materials`, `/api/sessions`)の統合テストが通る

#### E2Eテスト(オプション)
- [ ] ログインから教材生成、学習セッション、結果表示までの一連のフローがE2Eテストで検証される

#### ビルド・デプロイ
- [ ] `npm run build` がエラーなく完了する
- [ ] `npm run lint` がエラーなく完了する
- [ ] `npm run test` が全テストをパスする
- [ ] Railwayへのデプロイが成功する

### パフォーマンス

- [ ] URL入力画面の初期表示が2秒以内
- [ ] サマリ生成が30秒以内(OpenAI API呼び出し含む)
- [ ] 問題生成が30秒以内(OpenAI API呼び出し含む)
- [ ] ○×問題回答画面の表示が1秒以内
- [ ] 結果表示画面の表示が1秒以内

### セキュリティ

- [ ] パスワードは環境変数で管理され、ハードコードされていない
- [ ] OpenAI APIキーはサーバー側のみで使用され、クライアントに露出しない
- [ ] 認証CookieはHttpOnlyフラグが設定されている
- [ ] HTTPS通信のみ許可(本番環境)

---

## 制約条件

### 技術的制約
- **データベース不使用**: インメモリのみでデータ管理(永続化なし)
- **同時接続数**: 2-3人想定(スケーラビリティは考慮しない)
- **デモ用途**: 本番環境レベルのセキュリティは不要

### スコープ外
- ユーザー管理機能(複数ユーザー対応)
- 学習履歴の永続化
- 高可用性・冗長化
- モバイルアプリ対応

---

## 参考資料

### プロジェクトドキュメント
- [ユーザーストーリー](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/01-requirements/05-user-stories.md)
- [技術スタック](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/01-tech-stack.md)
- [リポジトリ構造](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/02-repository-structure.md)
- [データ構造](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/04-data-structures.md)
- [API仕様](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/05-api-spec.md)
- [アーキテクチャ](file:///c:/Users/Takey/Desktop/Wikipedia-To-LearningMaterial/docs/project/04-design/06-architecture.md)

### 外部リソース
- [Wikipedia API Documentation](https://www.mediawiki.org/wiki/API:Main_page)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)

---

## メモ

### 実装順序の推奨

1. **フェーズ1: 認証機能** (US-007)
   - 他の機能の前提条件
   - 早期にセキュリティを確保

2. **フェーズ2: Wikipedia API連携** (US-001)
   - 教材生成の基盤

3. **フェーズ3: OpenAI API連携** (US-002, US-003)
   - サマリ・問題生成

4. **フェーズ4: 教材生成機能** (US-001, US-002)
   - URL入力からサマリ表示まで

5. **フェーズ5: 学習セッション機能** (US-003, US-004, US-005, US-006)
   - 問題回答から結果表示まで

6. **フェーズ6: エラーハンドリング** (US-008)
   - 全体のエラーケース対応

7. **フェーズ7: テスト・検証**
   - ユニットテスト、統合テスト、E2Eテスト

### 注意事項

- **インメモリ管理**: セッションデータはサーバー再起動で消失する(仕様)
- **OpenAI APIコスト**: デモ用途のため、レート制限は実装しない
- **エラーハンドリング**: ユーザーフレンドリーなメッセージを心がける
- **型安全性**: TypeScriptで厳密な型定義を維持する
。
