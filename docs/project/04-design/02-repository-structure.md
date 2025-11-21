# リポジトリ構造

<!--
何を書くか: プロジェクトのディレクトリ構造とファイル配置の規則

目的:
  - 新規メンバーのオンボーディング支援
  - コードの配置場所を明確化
  - プロジェクト全体の見通しを向上
  - アーキテクチャパターンの一貫性維持
  - リファクタリング時の指針

重要性:
  - コードベースのナビゲーション効率化
  - 機能追加時の配置判断を迅速化
  - アーキテクチャ決定の可視化
  - チーム間の認識統一
  - ツール（IDE、ビルドツール）の設定基盤

記載のポイント:
  - アーキテクチャパターンを明示（レイヤードアーキテクチャ、クリーンアーキテクチャ、ドメイン駆動設計など）
  - ディレクトリの責務を明確に記載
  - 命名規則を具体例とともに提示
  - 依存関係のルールを記載（例: インフラ層はドメイン層に依存可能、逆は不可）
  - モノレポ/マルチレポの戦略を明記
  - 共通パターン（コロケーション、機能ベース、レイヤーベース）の選択理由

更新頻度:
  - プロジェクト初期に作成
  - アーキテクチャ変更時に更新
  - 新しいディレクトリを追加する際に更新
  - 四半期ごとに見直し（実際の構造との乖離確認）
-->

---

## リポジトリ戦略

**タイプ**: シングルリポジトリ（モノリス）  
**デプロイ**: 単一Next.jsアプリケーション（フロントエンド + バックエンド統合）  
**理由**: デモプロジェクトのため、最小構成でシンプルさを優先

### メリット
- ✅ 単一の`git push`で自動デプロイ（Railway）
- ✅ フロントエンドとバックエンドで型定義を共有
- ✅ 低コスト（単一サービス $5-10/month）
- ✅ 学習コスト最小（Next.jsの標準構造に従う）

---

## ディレクトリ構造

```
Wikipedia-To-LearningMaterial/         # プロジェクトルート（GitHubリポジトリ）
├── app/                               # Next.js App Router（ルーティング + ページ + API）
│   ├── api/                          # バックエンドAPI Routes
│   │   ├── auth/                     # 認証API
│   │   │   └── route.ts             # POST /api/auth（ベーシック認証検証）
│   │   ├── generate-summary/         # サマリ生成API
│   │   │   └── route.ts             # POST /api/generate-summary
│   │   └── generate-questions/       # ○×問題生成API
│   │       └── route.ts             # POST /api/generate-questions
│   ├── (auth)/                       # ルートグループ: 認証が必要なページ
│   │   ├── quiz/                     # ○×問題回答ページ
│   │   │   └── page.tsx             # /quiz
│   │   ├── results/                  # 結果表示ページ
│   │   │   └── page.tsx             # /results
│   │   └── layout.tsx                # 認証ページ共通レイアウト
│   ├── login/                        # ログインページ（認証前）
│   │   └── page.tsx                  # /login
│   ├── layout.tsx                    # ルートレイアウト（全ページ共通）
│   ├── page.tsx                      # ホームページ（/）- URL入力
│   └── globals.css                   # グローバルスタイル（Tailwind directives）
├── components/                        # 共通UIコンポーネント
│   ├── ui/                           # shadcn/ui コンポーネント
│   │   ├── button.tsx                # ボタンコンポーネント
│   │   ├── input.tsx                 # 入力フィールド
│   │   └── card.tsx                  # カードレイアウト
│   ├── QuizCard.tsx                  # ○×問題表示カード
│   ├── ResultsDisplay.tsx            # 結果表示コンポーネント
│   └── LoadingSpinner.tsx            # ローディング表示
├── lib/                              # ビジネスロジック、ユーティリティ、クライアント
│   ├── auth/                         # 認証ロジック
│   │   ├── basicAuth.ts              # ベーシック認証実装
│   │   └── middleware.ts             # 認証ミドルウェア
│   ├── openai/                       # OpenAI API クライアント
│   │   ├── client.ts                 # OpenAI API初期化
│   │   ├── generateSummary.ts        # サマリ生成ロジック
│   │   └── generateQuestions.ts      # ○×問題生成ロジック
│   ├── wikipedia/                    # Wikipedia API クライアント
│   │   ├── client.ts                 # Wikipedia API呼び出し
│   │   └── validateUrl.ts            # URL検証ロジック
│   ├── session/                      # セッション管理（インメモリ）
│   │   └── sessionStore.ts           # 学習セッションの状態管理
│   └── utils/                        # ユーティリティ関数
│       ├── formatters.ts             # データフォーマット（例: 正答率計算）
│       └── validators.ts             # バリデーション関数
├── types/                            # TypeScript型定義（フロント・バック共通）
│   ├── api.ts                        # API リクエスト/レスポンス型
│   ├── domain.ts                     # ドメインモデル型（LearningMaterial, QuizQuestion, Answer）
│   └── session.ts                    # セッション型
├── contexts/                         # React Context（状態管理）
│   ├── AuthContext.tsx               # 認証状態
│   └── QuizContext.tsx               # ○×問題セッション状態
├── hooks/                            # カスタムReact Hooks
│   ├── useAuth.ts                    # 認証フック
│   └── useQuiz.ts                    # ○×問題管理フック
├── __tests__/                        # テストコード
│   ├── unit/                         # ユニットテスト
│   │   ├── lib/                      # lib/ のテスト
│   │   └── components/               # components/ のテスト
│   └── integration/                  # 統合テスト
│       └── api/                      # APIルートのテスト
├── public/                           # 静的ファイル（画像、フォント）
│   └── favicon.ico                   # ファビコン
├── docs/                             # プロジェクトドキュメント（既存）
│   ├── project/                      # 要件定義、設計ドキュメント
│   └── README.md                     # ドキュメント目次
├── .github/                          # GitHub設定
│   └── workflows/                    # GitHub Actions
│       └── ci.yml                    # CI/CDパイプライン（lint, test）
├── .env.local                        # 環境変数（ローカル開発）- gitignore
├── .env.example                      # 環境変数テンプレート
├── .eslintrc.json                    # ESLint設定
├── .prettierrc                       # Prettier設定
├── .gitignore                        # Git除外設定
├── next.config.js                    # Next.js設定
├── tailwind.config.ts                # Tailwind CSS設定
├── tsconfig.json                     # TypeScript設定
├── vitest.config.ts                  # Vitest設定
├── package.json                      # 依存関係、スクリプト
├── package-lock.json                 # 依存関係ロック
└── README.md                         # プロジェクト概要、セットアップ手順
```

---

## アーキテクチャパターン

**採用パターン**: **Next.js App Router標準構造 + 機能ベース（最小構成）**

**理由**:
- Next.js App Router の規約に従い、学習コストを最小化
- 機能ごとにモジュール化（`lib/auth/`, `lib/openai/`, `lib/wikipedia/`）
- デモに不要な複雑性を排除（クリーンアーキテクチャ、レイヤードアーキテクチャは過剰）
- データベースなしのため、Repository層、Domain層は不要

**依存方向**:
```
app/             →  lib/ (ビジネスロジック)
app/             →  components/ (UIコンポーネント)
app/             →  types/ (型定義)
components/      →  types/
lib/             →  types/
hooks/           →  contexts/
hooks/           →  lib/
contexts/        →  lib/
```

**禁止される依存**:
- ❌ `lib/` → `app/`（ビジネスロジックがページに依存するのはNG）
- ❌ `lib/` → `components/`（ビジネスロジックがUIに依存するのはNG）
- ❌ `components/` → `app/`（共通コンポーネントがページに依存するのはNG）

---

## 主要ディレクトリ詳細

### `app/` - Next.js App Router

**責務**: ルーティング、ページ、レイアウト、APIエンドポイント

**特徴**:
- ファイルシステムベースルーティング
- `page.tsx` = ページ、`route.ts` = API Route、`layout.tsx` = レイアウト
- ルートグループ `(auth)` で認証が必要なページをグループ化

**ルール**:
- ページコンポーネントは薄く保つ（ビジネスロジックは`lib/`に配置）
- APIルートは薄く保つ（ロジックは`lib/`に委譲）

### `components/` - 共通UIコンポーネント

**責務**: 再利用可能なUIコンポーネント

**ルール**:
- 状態を持たない（stateless）コンポーネント推奨
- ビジネスロジックを含まない（表示のみ）
- shadcn/uiコンポーネントは`components/ui/`に配置

**命名規則**:
- PascalCase: `QuizCard.tsx`, `ResultsDisplay.tsx`
- 1ファイル1コンポーネント

### `lib/` - ビジネスロジック、クライアント、ユーティリティ

**責務**: ドメインロジック、外部API呼び出し、ユーティリティ関数

**サブディレクトリ**:
- `auth/`: 認証ロジック（ベーシック認証）
- `openai/`: OpenAI API クライアント（サマリ・問題生成）
- `wikipedia/`: Wikipedia API クライアント（記事取得）
- `session/`: インメモリセッション管理
- `utils/`: 汎用ユーティリティ関数

**ルール**:
- UIに依存しない（Reactコンポーネントをimportしない）
- テスタブル（純粋関数推奨）

### `types/` - TypeScript型定義

**責務**: フロントエンド・バックエンド共通の型定義

**主要ファイル**:
- `api.ts`: API リクエスト/レスポンス型
- `domain.ts`: ドメインモデル型（`LearningMaterial`, `QuizQuestion`, `Answer`, `LearningSession`）
- `session.ts`: セッション状態型

**ルール**:
- ユビキタス言語の用語を使用
- `interface` 優先（`type` は複雑な場合のみ）

### `contexts/` - React Context

**責務**: グローバル状態管理（認証状態、○×問題セッション）

**ルール**:
- 最小限のContextを使用（デモのため、Reduxなど不要）
- Context Providerは`app/layout.tsx`で配置

### `hooks/` - カスタムReact Hooks

**責務**: ロジックの再利用、状態管理の抽象化

**ルール**:
- `use`プレフィックス（例: `useAuth`, `useQuiz`）
- 単一責任の原則

### `__tests__/` - テストコード

**責務**: ユニットテスト、統合テスト

**構造**:
- `unit/`: lib/, components/ のユニットテスト
- `integration/`: API Routes の統合テスト

**命名規則**:
- `*.test.ts`, `*.test.tsx`

---

## 命名規則

### ファイル名

| タイプ | ケース | 例 |
|--------|--------|-----|
| Reactコンポーネント | PascalCase | `QuizCard.tsx`, `ResultsDisplay.tsx` |
| TypeScript/JavaScript | camelCase | `generateSummary.ts`, `formatters.ts` |
| Next.js特殊ファイル | lowercase | `page.tsx`, `layout.tsx`, `route.ts` |
| ディレクトリ | kebab-case | `generate-summary/`, `openai/` |
| テストファイル | `*.test.ts(x)` | `QuizCard.test.tsx`, `generateSummary.test.ts` |

### コード要素

| 要素 | ケース | 例 |
|------|--------|-----|
| 変数・関数 | camelCase | `const userName`, `function fetchArticle()` |
| 定数 | UPPER_SNAKE_CASE | `const API_BASE_URL`, `const MAX_QUESTIONS` |
| クラス・型 | PascalCase | `class LearningSession`, `interface QuizQuestion` |
| インターフェース | Iなし | `interface User` (✅), ~~`interface IUser`~~ (❌) |
| Enum | PascalCase（メンバーもPascalCase） | `enum AuthStatus { Authenticated, Unauthenticated }` |

---

## 環境変数

**ファイル**:
- `.env.local` - ローカル開発用（gitignore）
- `.env.example` - テンプレート（git管理）

**必須環境変数**:
```bash
# 認証
BASIC_AUTH_PASSWORD=your-secure-password

# OpenAI API
OPENAI_API_KEY=sk-...

# Next.js（自動設定）
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 本番はRailway URLに変更
```

**命名規則**:
- `NEXT_PUBLIC_` プレフィックス: クライアント側で使用可能
- プレフィックスなし: サーバー側のみ

---

## 依存関係管理

### パッケージマネージャー
**npm** - Node.js標準、追加ツール不要

### 主要依存関係

**本番依存**:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "openai": "^4.0.0",
    "react-hook-form": "^7.0.0"
  }
}
```

**開発依存**:
```json
{
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

---

## スクリプト

**package.json**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Git管理

**.gitignore** の主要項目:
```
# 依存関係
node_modules/
package-lock.json  # Railwayで自動生成

# Next.js
.next/
out/

# 環境変数
.env.local
.env.*.local

# テスト
coverage/

# IDE
.vscode/
.idea/
```

---

## 今後の拡張性

将来的に機能が増えた場合の構造案：

### データベース追加時
```
├── prisma/                 # Prisma ORM
│   ├── schema.prisma       # データベーススキーマ
│   └── migrations/         # マイグレーション
└── lib/
    └── db/                 # データベースクライアント
        └── client.ts
```

### 複雑化した場合（レイヤードアーキテクチャ）
```
└── lib/
    ├── domain/             # ドメインモデル、ビジネスルール
    ├── application/        # ユースケース、アプリケーションロジック
    └── infrastructure/     # 外部API、永続化
```

---

## メモ

### 変更履歴
- 2025-11-22: 初版作成（Next.js App Router + 機能ベース構造）

### 次のアクション
1. Next.jsプロジェクト初期化: `npx create-next-app@latest`
2. Tailwind CSS、shadcn/ui セットアップ
3. ディレクトリ作成: `lib/`, `types/`, `contexts/`, `hooks/`
4. `.env.example` 作成

### 注意事項
- 本構造はデモ用途に最適化されており、エンタープライズアプリケーションには追加の設計が必要
- データベースなしのため、Repository層、DAO層は不要
- スケール要件が変わった場合は、構造の見直しを検討
